module fitcoin_addr::fitcoin {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;

    /// Error codes
    const E_USER_NOT_REGISTERED: u64 = 1;
    const E_USER_ALREADY_REGISTERED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_INVALID_ACTIVITY: u64 = 4;

    /// FitCoin token structure
    struct FitCoin has key {}

    /// User profile stored on-chain
    struct UserProfile has key {
        username: String,
        full_name: String,
        height: u64, // in cm
        weight: u64, // in kg
        fitness_goal: String,
        total_calories_burned: u64,
        total_activities: u64,
        fitcoin_balance: u64,
        total_earned: u64,
        total_spent: u64,
        created_at: u64,
        is_verified: bool,
    }

    /// Activity record
    struct Activity has store, drop {
        activity_type: String,
        duration: u64, // in minutes
        calories_burned: u64,
        coins_earned: u64,
        timestamp: u64,
    }

    /// User activities storage
    struct UserActivities has key {
        activities: vector<Activity>,
        activity_events: EventHandle<ActivityEvent>,
    }

    /// Marketplace purchase record
    struct Purchase has store, drop {
        item_id: String,
        item_title: String,
        cost: u64,
        timestamp: u64,
    }

    /// User purchases storage
    struct UserPurchases has key {
        purchases: vector<Purchase>,
        purchase_events: EventHandle<PurchaseEvent>,
    }

    /// Events
    struct ActivityEvent has drop, store {
        user: address,
        activity_type: String,
        calories_burned: u64,
        coins_earned: u64,
        timestamp: u64,
    }

    struct PurchaseEvent has drop, store {
        user: address,
        item_id: String,
        cost: u64,
        timestamp: u64,
    }

    struct RegistrationEvent has drop, store {
        user: address,
        username: String,
        timestamp: u64,
    }

    /// Global events
    struct GlobalEvents has key {
        registration_events: EventHandle<RegistrationEvent>,
    }

    /// Initialize the module
    fun init_module(admin: &signer) {
        // Initialize FitCoin
        coin::initialize<FitCoin>(
            admin,
            string::utf8(b"FitCoin"),
            string::utf8(b"FC"),
            8, // decimals
            true, // monitor_supply
        );

        // Initialize global events
        move_to(admin, GlobalEvents {
            registration_events: account::new_event_handle<RegistrationEvent>(admin),
        });
    }

    /// Register a new user
    public entry fun register_user(
        user: &signer,
        username: String,
        full_name: String,
        height: u64,
        weight: u64,
        fitness_goal: String,
    ) acquires GlobalEvents {
        let user_addr = signer::address_of(user);
        
        // Check if user is already registered
        assert!(!exists<UserProfile>(user_addr), E_USER_ALREADY_REGISTERED);

        // Create user profile
        let profile = UserProfile {
            username,
            full_name,
            height,
            weight,
            fitness_goal,
            total_calories_burned: 0,
            total_activities: 0,
            fitcoin_balance: 0,
            total_earned: 0,
            total_spent: 0,
            created_at: timestamp::now_seconds(),
            is_verified: true,
        };

        // Create user activities storage
        let activities = UserActivities {
            activities: vector::empty<Activity>(),
            activity_events: account::new_event_handle<ActivityEvent>(user),
        };

        // Create user purchases storage
        let purchases = UserPurchases {
            purchases: vector::empty<Purchase>(),
            purchase_events: account::new_event_handle<PurchaseEvent>(user),
        };

        // Store on-chain
        move_to(user, profile);
        move_to(user, activities);
        move_to(user, purchases);

        // Emit registration event
        let global_events = borrow_global_mut<GlobalEvents>(@fitcoin_addr);
        event::emit_event(&mut global_events.registration_events, RegistrationEvent {
            user: user_addr,
            username: profile.username,
            timestamp: timestamp::now_seconds(),
        });

        // Give welcome bonus of 50 FitCoins
        mint_fitcoins(user, 50);
    }

    /// Record a fitness activity and earn coins
    public entry fun record_activity(
        user: &signer,
        activity_type: String,
        duration: u64,
        calories_burned: u64,
    ) acquires UserProfile, UserActivities {
        let user_addr = signer::address_of(user);
        
        // Check if user is registered
        assert!(exists<UserProfile>(user_addr), E_USER_NOT_REGISTERED);

        // Validate activity data
        assert!(duration > 0 && calories_burned > 0, E_INVALID_ACTIVITY);

        // Calculate coins earned (1 calorie = 0.1 coins)
        let coins_earned = calories_burned / 10;
        if (coins_earned == 0) {
            coins_earned = 1; // Minimum 1 coin per activity
        };

        // Update user profile
        let profile = borrow_global_mut<UserProfile>(user_addr);
        profile.total_calories_burned = profile.total_calories_burned + calories_burned;
        profile.total_activities = profile.total_activities + 1;
        profile.fitcoin_balance = profile.fitcoin_balance + coins_earned;
        profile.total_earned = profile.total_earned + coins_earned;

        // Create activity record
        let activity = Activity {
            activity_type,
            duration,
            calories_burned,
            coins_earned,
            timestamp: timestamp::now_seconds(),
        };

        // Store activity
        let activities = borrow_global_mut<UserActivities>(user_addr);
        vector::push_back(&mut activities.activities, activity);

        // Emit activity event
        event::emit_event(&mut activities.activity_events, ActivityEvent {
            user: user_addr,
            activity_type: activity.activity_type,
            calories_burned,
            coins_earned,
            timestamp: timestamp::now_seconds(),
        });

        // Mint FitCoins to user
        mint_fitcoins(user, coins_earned);
    }

    /// Purchase marketplace item
    public entry fun purchase_item(
        user: &signer,
        item_id: String,
        item_title: String,
        cost: u64,
    ) acquires UserProfile, UserPurchases {
        let user_addr = signer::address_of(user);
        
        // Check if user is registered
        assert!(exists<UserProfile>(user_addr), E_USER_NOT_REGISTERED);

        // Check if user has sufficient balance
        let profile = borrow_global_mut<UserProfile>(user_addr);
        assert!(profile.fitcoin_balance >= cost, E_INSUFFICIENT_BALANCE);

        // Deduct coins
        profile.fitcoin_balance = profile.fitcoin_balance - cost;
        profile.total_spent = profile.total_spent + cost;

        // Create purchase record
        let purchase = Purchase {
            item_id,
            item_title,
            cost,
            timestamp: timestamp::now_seconds(),
        };

        // Store purchase
        let purchases = borrow_global_mut<UserPurchases>(user_addr);
        vector::push_back(&mut purchases.purchases, purchase);

        // Emit purchase event
        event::emit_event(&mut purchases.purchase_events, PurchaseEvent {
            user: user_addr,
            item_id: purchase.item_id,
            cost,
            timestamp: timestamp::now_seconds(),
        });

        // Burn FitCoins
        burn_fitcoins(user, cost);
    }

    /// Mint FitCoins to user
    fun mint_fitcoins(user: &signer, amount: u64) {
        let coins = coin::mint<FitCoin>(amount, &coin::create_mint_ref<FitCoin>());
        coin::deposit(signer::address_of(user), coins);
    }

    /// Burn FitCoins from user
    fun burn_fitcoins(user: &signer, amount: u64) {
        let coins = coin::withdraw<FitCoin>(user, amount);
        coin::burn(coins, &coin::create_burn_ref<FitCoin>());
    }

    /// View functions

    #[view]
    public fun get_user_profile(user_addr: address): (String, String, u64, u64, String, u64, u64, u64, u64, u64, u64, bool) acquires UserProfile {
        assert!(exists<UserProfile>(user_addr), E_USER_NOT_REGISTERED);
        let profile = borrow_global<UserProfile>(user_addr);
        (
            profile.username,
            profile.full_name,
            profile.height,
            profile.weight,
            profile.fitness_goal,
            profile.total_calories_burned,
            profile.total_activities,
            profile.fitcoin_balance,
            profile.total_earned,
            profile.total_spent,
            profile.created_at,
            profile.is_verified
        )
    }

    #[view]
    public fun get_user_activities(user_addr: address): vector<Activity> acquires UserActivities {
        assert!(exists<UserActivities>(user_addr), E_USER_NOT_REGISTERED);
        let activities = borrow_global<UserActivities>(user_addr);
        activities.activities
    }

    #[view]
    public fun get_user_purchases(user_addr: address): vector<Purchase> acquires UserPurchases {
        assert!(exists<UserPurchases>(user_addr), E_USER_NOT_REGISTERED);
        let purchases = borrow_global<UserPurchases>(user_addr);
        purchases.purchases
    }

    #[view]
    public fun is_user_registered(user_addr: address): bool {
        exists<UserProfile>(user_addr)
    }

    #[view]
    public fun get_fitcoin_balance(user_addr: address): u64 acquires UserProfile {
        if (!exists<UserProfile>(user_addr)) {
            return 0
        };
        let profile = borrow_global<UserProfile>(user_addr);
        profile.fitcoin_balance
    }
}
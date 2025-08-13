# FitCoin - Web3 Fitness App

A decentralized fitness application built on Aptos blockchain where users earn FitCoins for physical activities and can spend them on real-world impact items.

## Features

### 🔐 Pure Web3 Authentication
- No passwords or traditional login
- Wallet connection = user identity
- Sign messages to authenticate actions

### ⛓️ Blockchain Integration
- User profiles stored on Aptos blockchain
- Activity tracking with on-chain verification
- FitCoin token earned for fitness activities
- Marketplace purchases recorded on-chain

### 🏃‍♂️ Fitness Tracking
- Real-time activity tracking
- Calorie-to-coin conversion (1 calorie = 0.1 FitCoin)
- Activity history stored on blockchain
- Achievement system

### 🛒 Marketplace
- Insurance discounts (10% & 25%)
- Advertising revenue opportunities
- Environmental impact (tree planting)
- All purchases verified on-chain

## Smart Contract

The FitCoin smart contract is written in Move language for Aptos blockchain:

### Key Functions
- `register_user()` - Register new user profile on-chain
- `record_activity()` - Record fitness activity and earn FitCoins
- `purchase_item()` - Purchase marketplace items with FitCoins
- `get_user_profile()` - View user data from blockchain
- `get_fitcoin_balance()` - Check FitCoin balance

### Contract Address
- Testnet: `0x42` (placeholder - replace with actual deployed address)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Aptos Wallet Adapter for Web3 integration
- Lucide React for icons

### Blockchain
- Aptos blockchain (Testnet)
- Move smart contracts
- Aptos TypeScript SDK
- Petra & Martian wallet support

### Supported Wallets
- Petra Wallet
- Martian Wallet
- Any Aptos-compatible wallet

## Getting Started

### Prerequisites
- Node.js 18+
- Aptos CLI (for contract deployment)
- Supported Aptos wallet (Petra/Martian)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fitcoin-web3
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

### Smart Contract Deployment

1. Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

2. Initialize Aptos account
```bash
aptos init
```

3. Deploy contract
```bash
cd contracts
aptos move publish --named-addresses fitcoin_addr=<your-address>
```

4. Update contract address in `src/services/blockchain.ts`

## How It Works

### 1. Wallet Connection
- User connects their Aptos wallet (Petra/Martian)
- App checks if user is registered on blockchain
- New users complete on-chain registration

### 2. Activity Tracking
- Start activity tracking in the app
- Real-time calorie calculation
- Stop tracking submits transaction to blockchain
- Smart contract mints FitCoins based on calories burned

### 3. Marketplace
- Browse available items (insurance, ads, eco-projects)
- Purchase with FitCoins
- Transaction recorded on blockchain
- Real-world benefits activated

### 4. Profile & History
- All data stored on Aptos blockchain
- View activity history and achievements
- Check FitCoin balance and transaction history
- Decentralized data ownership

## Web3 Benefits

### For Users
- **Own Your Data**: All fitness data stored on blockchain
- **No Passwords**: Wallet-based authentication
- **Earn Real Value**: FitCoins have utility in marketplace
- **Privacy**: Sensitive data kept off-chain
- **Transparency**: All transactions verifiable on blockchain

### For Developers
- **Decentralized**: No central server required
- **Immutable**: Activity records can't be tampered with
- **Composable**: Other apps can integrate with FitCoin
- **Global**: Works anywhere Aptos blockchain is accessible

## Smart Contract Security

- Input validation for all user data
- Balance checks before spending
- Activity verification to prevent cheating
- Event emission for transparency
- Access control for admin functions

## Future Enhancements

- [ ] Integration with fitness wearables
- [ ] Social features and challenges
- [ ] NFT achievements and badges
- [ ] Cross-chain bridge to other blockchains
- [ ] DAO governance for marketplace items
- [ ] Staking rewards for long-term holders

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Follow us on Twitter

---

**Move, Earn, Impact** - FitCoin makes fitness rewarding and meaningful through Web3 technology.
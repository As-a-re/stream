# SuiStream

SuiStream is a decentralized streaming platform built on the Sui blockchain. It features on-chain content ownership, subscriptions, watchlists, and reviews, powered by Move smart contracts and a modern web frontend.

---

## Features

- **On-chain content NFTs:** Own movies and shows as NFTs.
- **Subscriptions:** Purchase and renew streaming subscriptions.
- **Watchlists:** Manage your personal watchlist on-chain.
- **Reviews:** Leave and read reviews for content.
- **Treasury:** All payments are managed by a smart contract treasury.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Sui CLI](https://docs.sui.io/build/install) and Rust toolchain
- [Git](https://git-scm.com/)
- (Optional) Sui Wallet browser extension for frontend interaction

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/As-a-re/stream.git
cd suistream
```

---

### 2. Move Smart Contract

#### a. Install Sui CLI

Follow the [official Sui CLI install guide](https://docs.sui.io/build/install).

#### b. Build the Move Package

```sh
cd move
sui move build
```

#### c. Start a Local Sui Network

In a new terminal:

```sh
sui testnet start
```
or
```sh
sui start
```

#### d. Publish the Package

```sh
sui client publish --gas-budget 100000000
```

- Note the published package ID for frontend integration.

---

### 3. Frontend

#### a. Install Dependencies

```sh
cd ..
npm install
```

#### b. Start the Development Server

```sh
npm run dev
```

- The app will be available at [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

---

## Configuration

- Update the frontend configuration with your published Move package ID and any relevant object IDs.
- Make sure your wallet is connected to the same Sui network (local/testnet/devnet) as your contract.

---

## Troubleshooting

- **Network errors:** Check your internet connection and DNS settings.
- **Contract errors:** Ensure the Sui CLI and local network are running.
- **Frontend errors:** Check the terminal and browser console for missing dependencies or misconfigurations.

---

## License

MIT

---

## Acknowledgements

- Built with [Sui](https://sui.io/) and Move.
- Inspired by decentralized streaming and NFT platforms.

---

**Feel free to open issues or pull requests for improvements!**

# Ledger Live ICP Utilities

[![npm version](https://badge.fury.io/js/%40zondax%2Fledger-live-icp.svg)](https://badge.fury.io/js/%40zondax%2Fledger-live-icp)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

![zondax_light](docs/zondax_light.png#gh-light-mode-only)
![zondax_dark](docs/zondax_dark.png#gh-dark-mode-only)

_Please visit our website at [zondax.ch](https://www.zondax.ch)_

---

ICP (Internet Computer Protocol) Ledger Live integration bridge library developed by Zondax. This library provides essential utilities and functions for integrating ICP blockchain functionality into Ledger Live applications.

## Features

- 🔐 **Cryptographic Operations**: Secure signing and validation utilities
- 🧠 **Neuron Management**: Complete neuron data handling and voting power calculations
- 🔗 **Agent Integration**: ICP agent configuration and management
- 🏦 **Ledger Integration**: Full ICP ledger functionality
- ⚡ **Utilities**: Time handling, sub-accounts, public key operations, and validation helpers
- 📦 **Modular Design**: Clean exports and modular architecture

## Installation

```bash
npm install @zondax/ledger-live-icp
```

or

```bash
yarn add @zondax/ledger-live-icp
```

or

```bash
pnpm add @zondax/ledger-live-icp
```

## Usage

### Basic Import

```typescript
import {} from /* specific exports */ '@zondax/ledger-live-icp'
```

### Modular Imports

The library provides several modular entry points:

```typescript
// Canister IDL utilities
import {} from /* IDL exports */ '@zondax/ledger-live-icp/canisterIDL'

// Utility functions
import {} from /* utility exports */ '@zondax/ledger-live-icp/utils'

// Agent configuration
import {} from /* agent exports */ '@zondax/ledger-live-icp/agent'

// NNS (Network Nervous System) utilities
import {} from /* NNS exports */ '@zondax/ledger-live-icp/nns'

// Neuron management
import {} from /* neuron exports */ '@zondax/ledger-live-icp/neurons'
```

### Available Utilities

#### Cryptographic Operations

- Signing utilities with Secp256k1 support
- Hash functions
- Public key operations

#### Neuron Management

- Neuron data processing
- Voting power calculations
- Neuron-related constants and types

#### Validation & Helpers

- Input validation functions
- Time utilities
- Sub-account management

## API Reference

### Core Exports

The library re-exports key functionality from DFINITY packages:

- `@dfinity/candid` - Candid serialization/deserialization
- `@dfinity/ledger-icp` - ICP ledger operations
- `@dfinity/principal` - Principal handling
- `@dfinity/identity-secp256k1` - Secp256k1 public key operations
- `@dfinity/nns` - Network Nervous System integration

### Custom Modules

- **Agent** (`/agent`): ICP agent configuration and setup
- **Canister IDL** (`/canisterIDL`): Custom canister interface definitions
- **Utils** (`/utils`): Comprehensive utility functions
- **NNS** (`/nns`): Network Nervous System utilities
- **Neurons** (`/neurons`): Neuron management and voting power calculations

## Development

### Prerequisites

- Node.js (latest LTS recommended)
- pnpm (recommended package manager)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd ledger-live-icp

# Install dependencies
pnpm install
```

### Available Scripts

```bash
# Build the project
pnpm build

# Development mode with watch
pnpm dev

# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test
```

### Project Structure

```
src/
├── agent.ts          # ICP agent utilities
├── canisterIDL.ts    # Canister interface definitions
├── index.ts          # Main entry point
├── nns.ts           # NNS utilities
├── neurons/         # Neuron management
│   ├── consts.ts    # Constants
│   ├── neuronData.ts # Neuron data processing
│   ├── types.ts     # Type definitions
│   └── votingPower.ts # Voting power calculations
└── utils/           # Utility functions
    ├── hash.ts      # Hashing utilities
    ├── pubKey.ts    # Public key operations
    ├── signing.ts   # Signing utilities
    ├── subAccount.ts # Sub-account management
    ├── time.ts      # Time utilities
    └── validations.ts # Validation functions
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## About Zondax

[Zondax](https://zondax.ch/) is a leading provider of blockchain security and infrastructure solutions, specializing in hardware wallet integrations and blockchain protocol implementations.

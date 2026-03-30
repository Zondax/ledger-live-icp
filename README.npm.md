# @zondax/ledger-live-icp

[![npm version](https://badge.fury.io/js/%40zondax%2Fledger-live-icp.svg)](https://badge.fury.io/js/%40zondax%2Fledger-live-icp)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

![zondax_light](docs/zondax_light.png#gh-light-mode-only)
![zondax_dark](docs/zondax_dark.png#gh-dark-mode-only)

_Please visit our website at [zondax.ch](https://www.zondax.ch)_

---

ICP (Internet Computer Protocol) Ledger Live integration bridge library developed by Zondax.

## Installation

```bash
npm install @zondax/ledger-live-icp
```

## Quick Start

```typescript
// Basic imports
import { Principal } from '@zondax/ledger-live-icp'

// Modular imports
import {} from /* utils */ '@zondax/ledger-live-icp/utils'
import {} from /* neuron exports */ '@zondax/ledger-live-icp/neurons'
import {} from /* agent exports */ '@zondax/ledger-live-icp/agent'
```

## Modular Exports

- `/utils` - Utility functions (signing, validation, time, etc.)
- `/neurons` - Neuron data processing and calculations
- `/agent` - ICP agent configuration
- `/nns` - Network Nervous System utilities
- `/canisterIDL` - Canister interface definitions

## License

Apache-2.0

## About

Developed by [Zondax](https://zondax.ch/) - blockchain security and infrastructure solutions.

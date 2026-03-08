# ZK Income Oracle — Setup Guide

## Prerequisites
- Node.js >= 20
- Rust (optional, for Noir/BB if building from source)
- Argent X or Braavos wallet with Sepolia STRK

## Step-by-Step Setup

### 1. Install tools
```bash
# Noir
noirup --version 1.0.0-beta.3

# Barretenberg
bbup --version 0.85.0

# Scarb  
# (Self-install: https://docs.swmansion.com/scarb/download.html)
# or: curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh -s -- -v 2.9.2

# Starknet Foundry
# curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
```

### 2. Compile circuit
```bash
chmod +x scripts/compile_circuit.sh
./scripts/compile_circuit.sh
# Generates target/income_oracle.json and target/vk.bin
```

### 3. Build Cairo contracts
```bash
cd contracts
scarb build
# Generates target/dev/income_oracle_IncomeOracle.contract_class.json
```

### 4. Deploy Cairo contracts
```bash
# Set up a sncast account first
sncast account create --name discovery_deployer --type openzeppelin
# Fund it with STRK on Sepolia!
# sncast account deploy --name discovery_deployer --fee-token strk

chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 5. Update environment files
```bash
# backend/.env
# ORACLE_CONTRACT_ADDRESS=0x...

# frontend/.env
# VITE_ORACLE_ADDRESS=0x...
```

### 6. Start backend
```bash
cd backend
npm install
npm run dev
# → Running on http://localhost:3001
```

### 7. Start frontend
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

### 8. Test everything
```bash
chmod +x scripts/test_flow.sh
./scripts/test_flow.sh
```

## Full Demo Flow
1. Open http://localhost:5173
2. Connect Argent X or Braavos wallet (Sepolia)
3. Click "Generate Income Proof"
4. Watch: scan → prove (client-side ~2s) → submit to Sepolia
5. See TX on Starkscan

#!/bin/bash
set -e

echo "=== Building Cairo contracts ==="
cd contracts
~/.local/share/scarb-install/2.9.2/bin/scarb build

echo "=== Declaring IncomeOracle contract ==="
~/.local/bin/sncast declare \
  --contract-name IncomeOracle \
  | tee declare_output.txt

CLASS_HASH=$(grep "class_hash:" declare_output.txt | awk '{print $2}')
echo "✅ Class hash: $CLASS_HASH"

echo "=== Deploying IncomeOracle ==="
~/.local/bin/sncast deploy \
  --class-hash "$CLASS_HASH" \
  | tee deploy_output.txt

CONTRACT_ADDRESS=$(grep "contract_address:" deploy_output.txt | awk '{print $2}')
echo "✅ Contract deployed at: $CONTRACT_ADDRESS"

echo ""
echo "=== SAVE THIS: ==="
echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
echo ""
echo "Add to backend/.env:"
echo "ORACLE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
echo ""
echo "View on Starkscan:"
echo "https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"

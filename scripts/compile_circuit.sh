#!/bin/bash
set -e

echo "=== Step 1: Compiling Noir circuit ==="
cd circuit
nargo compile
echo "✅ Circuit compiled → target/income_oracle.json"

echo "=== Step 2: Generating verification key ==="
/home/shivamsoni/.bb/bb write_vk -b target/income_oracle.json -o ./target
mv target/vk target/vk.bin
echo "✅ Verification key generated → target/vk.bin"

echo ""
echo "=== ALL DONE. Now build and deploy the IncomeOracle contract. ==="

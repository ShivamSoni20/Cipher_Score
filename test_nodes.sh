#!/bin/bash
NODES=(
  "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
  "https://rpc.nethermind.io/sepolia-juno"
  "https://starknet-sepolia.lava.build"
  "https://alpha-sepolia.starknet.io"
  "https://starknet-sepolia-rpc.publicnode.com"
)

for URL in "${NODES[@]}"; do
  echo "Testing $URL ..."
  curl -s -X POST -H 'Content-Type: application/json' \
    -d '{"jsonrpc":"2.0","method":"starknet_specVersion","params":[],"id":1}' \
    "$URL" | head -c 100
  echo -e "\n"
done

#!/bin/bash
ADDR="0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"
RPC="https://starknet-sepolia-rpc.publicnode.com"

echo "Checking Class Hash at address..."
curl -s -X POST -H 'Content-Type: application/json' -H 'User-Agent: Mozilla/5.0' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"starknet_getClassHashAt\",\"params\":[\"latest\",\"$ADDR\"],\"id\":1}" $RPC

echo -e "\nChecking STRK Balance..."
curl -s -X POST -H 'Content-Type: application/json' -H 'User-Agent: Mozilla/5.0' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"starknet_call\",\"params\":[{\"contract_address\":\"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d\",\"entry_point_selector\":\"0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82\",\"calldata\":[\"$ADDR\"]},\"latest\"],\"id\":2}" $RPC

echo -e "\nChecking ETH Balance..."
curl -s -X POST -H 'Content-Type: application/json' -H 'User-Agent: Mozilla/5.0' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"starknet_call\",\"params\":[{\"contract_address\":\"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7\",\"entry_point_selector\":\"0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82\",\"calldata\":[\"$ADDR\"]},\"latest\"],\"id\":3}" $RPC
echo

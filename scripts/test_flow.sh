#!/bin/bash
echo "=== ZK Income Oracle — End-to-End Test ==="

echo ""
echo "1. Testing backend health..."
curl -s http://localhost:3001/health | python3 -m json.tool

echo ""
echo "2. Testing circuit availability..."
curl -s http://localhost:3001/api/circuit | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('Circuit available:', 'bytecode' in d)
print('Circuit name:', d.get('name', 'unknown'))
"

echo ""
echo "3. Testing wallet scan (demo address)..."
curl -s -X POST http://localhost:3001/api/wallet/scan \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35Cc6634C0532925a3b8D4C9E8f3a2b1d4e7"}' \
  | python3 -m json.tool

echo ""
echo "4. Testing stats endpoint..."
curl -s http://localhost:3001/api/stats | python3 -m json.tool

echo ""
echo "=== Backend tests complete ==="
echo "Next: Open http://localhost:5173 and test the full ZK flow"

import json
import urllib.request
import time

def call_rpc(method, params):
    url = "https://starknet-sepolia-rpc.publicnode.com"
    data = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": int(time.time())
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as f:
            return json.loads(f.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

target = "0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"

print(f"Checking {target} as Transaction Hash...")
res_tx = call_rpc("starknet_getTransactionByHash", [target])
print(f"  Transaction: {res_tx.get('result', res_tx.get('error'))}")

print(f"\nChecking {target} as Class Hash...")
# Try to get class
res_class = call_rpc("starknet_getClass", ["latest", target])
print(f"  Class: {'Found' if 'result' in res_class else res_class.get('error')}")

print(f"\nChecking {target} as Account Address (Nonce)...")
res_nonce = call_rpc("starknet_getNonce", ["latest", target])
print(f"  Nonce: {res_nonce.get('result', res_nonce.get('error'))}")

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

tx_hash = "0x319fb4fda117a1bbb6a2cf67376ff869617745143e826c1d83697ada8ac51c6"
print("=== Transaction Details ===")
res = call_rpc("starknet_getTransactionByHash", [tx_hash])
print(json.dumps(res, indent=2))

print("\n=== Transaction Receipt ===")
res2 = call_rpc("starknet_getTransactionReceipt", [tx_hash])
print(json.dumps(res2, indent=2))

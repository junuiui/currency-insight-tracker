import sys
import os
import json
from dotenv import load_dotenv

# .env
load_dotenv()

current_dir = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.abspath(os.path.join(current_dir, "..", "src"))
sys.path.insert(0, src_path)

try:
    from get_rates_handler import lambda_handler

    print("✅ Import Successful!")
except ImportError as e:
    print(f"❌ Import Failed: {e}")
    sys.exit(1)

# 1. Mock Event
# pair: USD_KRW
# days: today to (today - days)
mock_event = {"pair": "USD_KRW", "days": 500}
mock_context = None

print(f"--- Local Get Test Start (Pair: {mock_event['pair']}) ---")

# 2. Lambda
response = lambda_handler(mock_event, mock_context)

# 3. Print Status Code
print(f"Status Code: {response['statusCode']}")

# Result Parsing
body = json.loads(response["body"])

if response["statusCode"] == 200:
    print(f"Message: {body.get('range')} Success")
    print(f"Total Count: {body.get('count')} items found.")
    print("-" * 30)

    for item in body.get("data", []):
        print(f"[{item['Date']}] {item['CurrencyPair']}: {item['Rate']}")
else:
    print(f"Error: {body.get('error')}")

print("--- Local Get Test End ---")

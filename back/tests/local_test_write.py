import sys
import os
from dotenv import load_dotenv

load_dotenv()

collect_bases_str = os.environ.get("COLLECT_BASES", "CAD")
collect_bases_list = [b.strip() for b in collect_bases_str.split(",")]

# src 폴더를 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.abspath(os.path.join(current_dir, "..", "src"))
sys.path.insert(0, src_path)

try:
    from write_rates_handler import lambda_handler

    print("Import Successful!")
except ImportError as e:
    print(f"Import Failed: {e}")
    print(f"Current sys.path: {sys.path}")
    sys.exit(1)

# mock aws event
mock_event = {"base": collect_bases_list}
mock_context = None

print("--- Local Test Start ---")
response = lambda_handler(mock_event, mock_context)
print(f"Status: {response['statusCode']}")
print(f"Body: {response['body']}")
print("--- Local Test End ---")

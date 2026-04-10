import sys
import os
from dotenv import load_dotenv

load_dotenv()

DEFAULT_BASE_CURRENCY = os.environ.get('DEFAULT_BASE')

# src 폴더를 경로에 추가
current_dir = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.abspath(os.path.join(current_dir, '..', 'src'))
sys.path.insert(0, src_path)

try:
    from lambda_handler import lambda_handler
    print("Import Successful!")
except ImportError as e:
    print(f"Import Failed: {e}")
    print(f"Current sys.path: {sys.path}")
    sys.exit(1)

# mock aws event
mock_event = {'base': DEFAULT_BASE_CURRENCY}
mock_context = None

print("--- Local Test Start ---")
response = lambda_handler(mock_event, mock_context)
print(f"Status: {response['statusCode']}")
print(f"Body: {response['body']}")
print("--- Local Test End ---")

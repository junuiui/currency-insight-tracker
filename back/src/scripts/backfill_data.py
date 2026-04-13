import sys
import os
import time
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

# 현재 파일(backfill_data.py)의 절대 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
# 한 단계 위인 'src' 폴더 경로를 계산
src_path = os.path.abspath(os.path.join(current_dir, '..'))

# sys.path의 맨 앞에 추가
if src_path not in sys.path:
  sys.path.insert(0, src_path)

try:
  from write_rates_handler import save_to_db
  print("Import Successful!")
except ImportError as e:
  print(f"Import Failed: {e}")
  sys.exit(1)
  
load_dotenv()

def backfill_year(target_year):
  # .env에서 설정 읽기
  collect_bases = os.environ.get('COLLECT_BASES', 'CAD').split(',')
  
  start_date = datetime(target_year, 1, 1)
  end_date = datetime(target_year, 12, 31)
  
  if target_year == datetime.now().year:
      end_date = datetime.now()

  current_date = start_date
  while current_date <= end_date:
    if current_date.weekday() < 5:
      date_str = current_date.strftime('%Y-%m-%d')
      print(f"\n--- Processing Date: {date_str} ---")
      
      for base in collect_bases:
        base = base.strip()
        api_url = f"https://api.frankfurter.app/{date_str}?from={base}"
        
        try:
          response = requests.get(api_url, timeout=5)
          if response.status_code == 200:
            data = response.json()
            save_to_db(data['base'], data['rates'], data['date'])
          else:
            print(f"No data for {base} on {date_str}")
          
          # to avoid jam in API
          time.sleep(0.1)
            
        except Exception as e:
          print(f"Error for {base} on {date_str}: {e}")
                
    current_date += timedelta(days=1)
    
if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python backfill_data.py <year>")
    print("Example: python backfill_data.py 2025")
    sys.exit(1)

  try:
    target = int(sys.argv[1])
    
    current_year = datetime.now().year
    if target < 1999 or target > current_year:
        print(f"Error: Year must be between 1999 and {current_year}")
        sys.exit(1)

    print(f"Starting Backfill for year: {target}")
    backfill_year(target)
    print(f"Backfill for {target} DONE!")

  except ValueError:
    print("Error: Please provide a valid year (e.g., 2025)")
    sys.exit(1)
import json
import requests
import os
import boto3 # aws python SDK'
from botocore.exceptions import ClientError
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

REGION = os.environ.get('AWS_REGION_NAME')
TABLE_NAME = os.environ.get('DYNAMODB_TABLE')
TARGET_CURRENCIES = os.environ.get('TARGET_CURRENCIES', '').split(',')

dynamodb = boto3.resource('dynamodb', REGION)
table = dynamodb.Table(TABLE_NAME)

def save_to_db(base, rates, date):
  print("LOG: save_to_db CALLED")
  
  for target in TARGET_CURRENCIES:
    if target in rates:
      try:
        table.put_item(
            Item={
                'CurrencyPair': f"{base}_{target}",
                'Date': date,
                'Rate': str(rates[target]),
                'UpdatedAt': datetime.now().isoformat()
            },

            ConditionExpression='attribute_not_exists(CurrencyPair) AND attribute_not_exists(#d)',
            ExpressionAttributeNames={'#d': 'Date'}
        )
        print(f"Saved: {base}_{target}")
        
      except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
          print(f"   [-] Already in DB: {base}_{target} ({date})") 
        else:
          print(f"   [!] AWS Error: {e.response['Error']['Message']}")
          raise e
                  
  print("LOG: save_to_db DONE")
    
def lambda_handler(event, context):
  print("-----Lambda Called-----")
  """
  AWS Lambda Entry Point Function  
  :param event: Sent data   
  :param context: call env info  
  """

  # set base currency, default = CAD
  base_input = event.get('base', 'CAD')
  base_currencies = base_input if isinstance(base_input, list) else [base_input]
  
  # for logs
  logs = []
  
  has_error = False
  
  for base in base_currencies:
    api_url = f"https://api.frankfurter.app/latest?from={base}"
    
    try:
      print(f"Fetching data for base: {base}")
      response = requests.get(api_url)
      response.raise_for_status()
      data = response.json()
      
      # DB 저장 함수 호출
      save_to_db(data['base'], data['rates'], data['date'])
      logs.append(f"Success: {base}")
    
    except Exception as e:
      print(f"Error fetching {base}: {e}")
      logs.append(f"Failed: {base}")
      has_error = True
    
  status_code = 500 if has_error and len(logs) == len(base_currencies) else 200
  
  return {
    'statusCode': status_code,
    'body': json.dumps({
        'result': logs,
        'timestamp': datetime.now().isoformat()
    })
  }

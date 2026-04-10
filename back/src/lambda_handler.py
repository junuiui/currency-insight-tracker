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

print("DYNAMODB:", table)

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
            print(f"Skip: Data already exists for {base}_{target} on {date}")
        else:
            print(f"AWS Error: {e.response['Error']['Message']}")
            raise e
                  
  print("LOG: save_to_db DONE")
    
def lambda_handler(event, context):
  print("-----Lambda Called-----")
  """
  AWS Lambda Entry Point Function  
  :param event: Sent data   
  :param context: call env info  
  
  """

  # set base currency as CAD
  base_currency = event.get('base', 'CAD')
  
  # external API URL 
  api_url = api_url = f"https://api.frankfurter.app/latest?from={base_currency}"

  try:
    # API Call
    response = requests.get(api_url)
    response.raise_for_status() # automatic exception
    data = response.json()
    
    save_to_db(data['base'], data['rates'], data['date'])

    return {
      'statusCode': 200,
      'body': json.dumps({
        'message': 'Success: Rates updated in DynamoDB',
        'base': data['base'],
        'date': data['date']
      })
    }
  
  except Exception as e:
    print(f"Error: {e}")
    return {
        'statusCode': 500,
        'body': json.dumps({'message': 'Failed to save data', 'error': str(e)})
    }


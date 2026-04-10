import json
import requests
import os
import boto3 # aws python SDK
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
table = dynamodb.Table('CurrencyRates')

print("DYNAMODB:", table)

def save_to_db(base, rates, date):
  """
  From the passed data, store it in db
  """
  
  print("LOG: save_to_db CALLED")
  # Target Country lists
  target_currencies = ['KRW', 'USD', 'CAD', 'JPY', 'EUR']
  
  with table.batch_writer() as batch:
    for target in target_currencies:
      if target in rates:
        batch.put_item(
          Item={
            'CurrencyPair': f"{base}_{target}", # Partition Key (ex: CAD_KRW)
            'Date': date,                       # Sort Key (ex: 2026-04-10)
            'Rate': str(rates[target]),
            'UpdatedAt': datetime.now().isoformat()
          }
        )
        
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


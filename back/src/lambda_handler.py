import json
import requests
import os
from datetime import datetime


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
      
      print(data)

      result = {
          "base": data.get("base"),
          "date": data.get("date"),
          "rates": data.get("rates"),
          "collected_at": datetime.now().isoformat()
      }
      print("-----Lambda Ended-----")
      return {
          'statusCode': 200,
          'body': json.dumps(result)
      }
  
  except Exception as e:
      print(f"Error: {e}")
      print("-----Lambda Ended-----")
      return {
          'statusCode': 500,
          'body': json.dumps({'message': 'Internal Server Error', 'error': str(e)})
      }


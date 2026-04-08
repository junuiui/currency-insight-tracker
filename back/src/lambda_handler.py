import json
import requests
import os
from datetime import datetime


def lambda_handler(event, context):

    # from .env, take API URL
    base_currency = event.get('base', 'CAD')
    api_url = api_url = f"https://api.frankfurter.app/latest?from={base_currency}"

    try:
        # API Call
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()

        result = {
            "base": data.get("base"),
            "date": data.get("date"),
            "rates": data.get("rates"),
            "collected_at": datetime.now().isoformat()
        }

        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error', 'error': str(e)})
        }

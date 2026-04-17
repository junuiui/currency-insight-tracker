import json
import boto3
import os
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta
from dotenv import load_dotenv

# #############
# Setting
# #############
load_dotenv()

REGION = os.environ.get("AWS_REGION_NAME")
TABLE_NAME = os.environ.get("DYNAMODB_TABLE")
dynamodb = boto3.resource("dynamodb", REGION)
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):

    # Get param (USD_KRW, 7)
    pair = event.get("pair", "USD_KRW")
    days = int(event.get("days", 7))

    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    try:
        response = table.query(
            KeyConditionExpression=Key("CurrencyPair").eq(pair)
            & Key("Date").between(start_date, end_date)
        )
        print(f"DEBUG: Querying {pair} from {start_date} to {end_date}")
        items = response.get("Items", [])

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "pair": pair,
                    "range": f"{start_date} to {end_date}",
                    "count": len(items),
                    "data": items,
                }
            ),
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}

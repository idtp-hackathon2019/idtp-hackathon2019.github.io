from __future__ import print_function
import json
import boto3
dynamodb = boto3.resource('dynamodb')

import decimal
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    #Get input values
    try:
        startDate = event["query"]["startDate"]
        endDate = event["query"]["endDate"]
    except:
        return {
            "ErrorMsg": "Missing parameter(s) upc or scannedDateTime.",
            "Body": ""
        }

    historicalDataTable = dynamodb.Table("HackathonHistoricalData")

    histDoc = historicalDataTable.query(
            KeyConditionExpression=Key('primaryID').eq('1') & Key('dateScanned').between(startDate, endDate)
        )['Items']

    print(histDoc)


    return histDoc
    

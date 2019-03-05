import json
import boto3
dynamodb = boto3.resource('dynamodb')

from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    table = dynamodb.Table("HackathonCurrentData")
    response = table.scan(
            #FilterExpression=Attr('Hour').begins_with(beginsWith) & Attr('Park').eq(parkName)
    )

    return response['Items']

    '''return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }'''

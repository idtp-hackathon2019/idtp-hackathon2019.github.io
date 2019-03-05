import json
import boto3
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):

    try:
        upc_code = event["query"]["upc"]
        scannedDateTime = event["query"]["scannedDateTime"]
        newExpDate = event["query"]["newExpDate"]
    except:
        return {
            "ErrorMsg": "Missing parameter(s) upc, newExpDate or scannedDateTime.",
            "Body": ""
        }


    table = dynamodb.Table("HackathonCurrentData")
    #Get current list of items
    try:
        document = table.get_item(Key={'upc': upc_code})["Item"]
        print("original item list:", document['items'])
        items = document["items"]
    except:
        return "Error getting current item details."

    #update item list
    try:
        for x in items:
            if scannedDateTime == x['scannedDateTime']:
                x['expDate'] = newExpDate
        #print("items after update: ", items)
    except:
        return "Error finding item in list of items."


    try:
        table.put_item(Item=document, ReturnValues='NONE')
    except:
        return "Error updating item"

    return "Item expiration date updated."

import json
import http.client
import boto3
import datetime
from random import *
from datetime import date
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    print(event['Records'][0]['eventName'])
    eventName = str(event['Records'][0]['eventName'])
    if eventName == "INSERT":
        print("TEST!!!!!!")
        print("EVENT!!!: "+ str(event))

        upc = str(event['Records'][0]['dynamodb']['NewImage']['upc']['S'])
        print("UPC"+ upc)
        dataScan = str(event['Records'][0]['dynamodb']['NewImage']['dateTimeScanned']['S'])

        # upc = upc[2:]
        print(type(upc))
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

        table = dynamodb.Table('HackathonCurrentData')

        response = table.query(
            KeyConditionExpression=Key('upc').eq(upc)
        )

        if response['Items']:
            print("PRESENT!!!")
            # print(response)
            items = response['Items'][0]['items']
            print(type(items))
            print("old "+ str(items))
            randDays = randint(1, 30)
            expData = date.today()+ datetime.timedelta(days=400) + datetime.timedelta(days=randDays)
            items.append({"expDate": str(expData),"scannedDateTime": dataScan})
            print("new "+str(items))
            # print(str(items))

            nutritionData = response['Items'][0]['nutritionData']
            itemName = response['Items'][0]['itemName']
            # print(response)
        else:
            conn = http.client.HTTPSConnection("chompthis.com")
            conn.request("GET", "/api/product-code.php?token=1mbDWd3RIdQKCvJHD&code=" + upc)

            res = conn.getresponse()
            data = res.read()
            strData = (data.decode("utf-8"))
            print("ARP RESP"+strData)
            jsonData = json.loads(strData)
            if (jsonData['chomp']['response']['products_found'] == 0):
                return{ 'statusCode': 200}
            shortupc = upc
            while shortupc[0]=="0":
                shortupc = shortupc[1:]
            nutritionData_full = jsonData['products'][shortupc]['details']['nutrition_label'];
            nutritionData = {
                "carbohydrates": str(nutritionData_full['carbohydrates']['per_serving']) + nutritionData_full['carbohydrates']['measurement'],
                "fat": str(nutritionData_full['fat']['per_serving']) + nutritionData_full['fat']['measurement'],
                "proteins": str(nutritionData_full['proteins']['per_serving']) + nutritionData_full['proteins']['measurement'],
                "sugars": str(nutritionData_full['sugars']['per_serving']) + nutritionData_full['sugars']['measurement'],
                "calories": str(nutritionData_full['calories']['per_serving'])
            }
            randDays = randint(1, 30)
            expData = date.today()+ datetime.timedelta(days=randDays)
            items = [{"expDate": str(expData),"scannedDateTime": dataScan}]
            itemName = str(jsonData['products'][upc[2:]]['name'])

        item_data = {
             "upc":upc,
             "nutritionData": nutritionData,
             "items": items,
             "itemName": itemName
        }
        print("END REACH")
        table.put_item(Item=item_data)
    # TODO implement
    return {
        'statusCode': 200,
        'body': 'data'
    }

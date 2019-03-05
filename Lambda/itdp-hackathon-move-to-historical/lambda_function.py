from __future__ import print_function
import json
import boto3
dynamodb = boto3.resource('dynamodb')

import decimal
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    #Get input values
    try:
        upc_code = event["query"]["upc"]
        scannedDateTime = event["query"]["scannedDateTime"]
    except:
        return {
            "ErrorMsg": "Missing parameter(s) upc or scannedDateTime.",
            "Body": ""
        }


    currentDataTable = dynamodb.Table("HackathonCurrentData")
    historicalDataTable = dynamodb.Table("HackathonHistoricalData")


    #Get current list of items
    try:
        document = currentDataTable.get_item(Key={'upc': upc_code})["Item"]
        items = document["items"]
        print("original: ", items)
    except:
        return "Error getting current item details."

    #Remove item from list.
    try:
        tmpList = []
        for x in items:
            if scannedDateTime != x['scannedDateTime']:
                tmpList.append(x)
            else:
                delExpDate = x['expDate']
        document["items"] = tmpList
        print("new curr table item: ", document)
        #currentDataTable.put_item(Item=document, ReturnValues='NONE') #TODO uncomment me later
    except:
        return "Error finding item in list of items."


    dateDelItemScanned = scannedDateTime.split(' ')[0]
    print(dateDelItemScanned)
    #Check if date is already in history table
    try:
        histDoc = historicalDataTable.query(
            KeyConditionExpression=Key('primaryID').eq('1') & Key('dateScanned').between(dateDelItemScanned, dateDelItemScanned)
        )['Items']
        print(histDoc)

        if histDoc != []:
            print("Date already in history table.")
            #date IS already in history table. See if upc is there
            upcCodeAlreadyExists = False
            for x in histDoc[0]['details']:
                if x['upc'] == upc_code:
                    print("UPC code is already there")
                    #if upc IS there already, add new 'item' list item
                    tmpObj = {}
                    tmpObj['consumed'] = True
                    tmpObj['scannedDateTime'] = scannedDateTime
                    tmpObj['expDate'] = delExpDate
                    x['items'].append(tmpObj)
                    upcCodeAlreadyExists = True

            if upcCodeAlreadyExists == False:
                #if upc is NOT there already, add new 'details' list item
                print("UPC code is not there already")
                newDetails = document
                newDetails['items'] = []
                tmp = {}
                tmp['scannedDateTime'] = scannedDateTime
                tmp['expDate'] = delExpDate
                tmp['consumed'] = False
                newDetails['items'].append(tmp)
                histDoc[0]['details'].append(newDetails)

            historicalDataTable.put_item(Item=histDoc[0], ReturnValues='NONE')
        else:
            print("Date NOT already in history table")
            #date is NOT already in history table. Create newDocument item and add new item to history table
            tmp = {}
            tmp['scannedDateTime'] = scannedDateTime
            tmp['expDate'] = delExpDate
            tmp['consumed'] = True
            newDocument = {}
            newDocument['dateScanned'] = scannedDateTime.split(' ')[0]
            newDocument['primaryID'] = '1'
            newDocument['details'] = []
            tmp2 = {}
            tmp2['nutritionData'] = document['nutritionData']
            tmp2['upc'] = upc_code
            tmp2['items'] = []
            tmp2['items'].append(tmp)
            newDocument['details'].append(tmp2)
            historicalDataTable.put_item(Item=newDocument, ReturnValues='NONE')


    except:
        print("Error")

    print(histDoc)


    return "Item moved to historical table."

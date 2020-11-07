import boto3, time
import mysql.connector
import requests
from requests_aws4auth import AWS4Auth

region = "us-east-2" # e.g. us-west-1
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

host = 'https://vpc-crossover-bmb3metkdfnofvrbu7vxkmkpaa.us-east-2.es.amazonaws.com'
index = 'images'
type = 'entry'
url = host + '/' + index + '/' + type

headers = { "Content-Type": "application/json" }
db = mysql.connector.connect(
  host="database-crossover.cyou7lbdmw0u.us-east-2.rds.amazonaws.com",
  user="admin",
  password="XXXXX",
  database="Main"
)
# Lambda execution starts here
def handler(event, context):
  try:
    cursor = db.cursor()
    for record in event['Records']:
      time.sleep(3) # Wait for S3 metadata to be saved in RDS
      key = record['s3']['object']['key'] # Get the bucket name and key for the new file
      cursor.execute("SELECT * FROM Images WHERE UUID=%s", (key,))
      query = cursor.fetchall()
      if len(query) > 0:
        e = query[0]
        doc = {"uuid": e[0], "description": e[1], "type": e[2], "size": e[3]}
        r = requests.post(url, auth=awsauth, json=doc, headers=headers)
        return {"statusCode": r.status_code, "body": r.text}

    return {"statusCode": 404, "body": "Bucket item not found"}
  except Exception as e:
    return {"statusCode": 500, "body": "An error occurred", "err": str(e)}

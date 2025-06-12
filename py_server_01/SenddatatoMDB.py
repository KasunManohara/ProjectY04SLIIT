from pymongo import MongoClient
import firebase_admin
from firebase_admin import credentials, storage
import random


def SenddataFB(data):

    text = data.get("text")  # Extract the 'text' field
    date = data.get("date")  # Extract the 'date' field   
    num = random.random()
    txt = str(num)
    X_val = txt.split(".")[1]
    

    # Initialize the app with a service account, granting admin privileges
    cred = credentials.Certificate('serviceAccountKey.json')
    try:
      firebase_admin.initialize_app(cred, {
        'storageBucket': 'fir-image-6259e.appspot.com'  # Replace with your bucket name
        })
    except:
        print("An exception occurred")

    # Reference to the storage bucket
    bucket = storage.bucket()

    # Path to  local image file
    local_image_path = 'Detect_Affected/Affected_region_overlay.png'
    # Specify the destination path in the bucket
    blob = bucket.blob('images/'+date+text+X_val+'.jpg')  

    # Upload the image file
    blob.upload_from_filename(local_image_path)

    # Set custom metadata to include a download token (optional)
    from uuid import uuid4
    blob.metadata = {'firebaseStorageDownloadTokens': str(uuid4())}
    blob.patch()  # Update blob with new metadata

    print(blob.name.split("/"))
    correction = blob.name.split("/")
    corr_URL = correction[0] +"%2F"+correction[1]

    # Constructing the download URL
    download_url = f'https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{corr_URL}?alt=media&token={blob.metadata["firebaseStorageDownloadTokens"]}'

    print(f'File uploaded and can be downloaded from: {download_url}')  # Print download URL of uploaded file
    return download_url







def SenddatatoMDB(state,data):

    URL_Affected =SenddataFB(data)

    Racknumber = data.get("text")  # Extract the 'text' field
    date = data.get("date")  # Extract the 'date' field
    URL = data.get("imageUrl")
    print(type(state))
    print(f"Received text: {Racknumber}, Age: {date}, URL: {URL}") 
    print(state)

 
    client = MongoClient('mongodb+srv://it21014604:it21014604@mushroomc.ql6ll.mongodb.net/?retryWrites=true&w=majority&appName=mushroomc')
    db = client['mushroomc']
    collection = db['contaminations']

    document ={"Racknumber":Racknumber,"Image_Date":date,"State":state,"Good_Image_Url":URL,"Affected_Image_Url":URL_Affected}
    inserted_document = collection.insert_one(document)
    print(f"Inserted Document ID: {inserted_document.inserted_id}")
    client.close()
  
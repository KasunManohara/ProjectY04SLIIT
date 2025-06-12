import firebase_admin
from firebase_admin import credentials, storage


def DeleteImageFB(URL_):
    print(URL_)
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


    
    x = URL_.split("%2F")
    Image_name = x[1].split("?alt=")
    print(Image_name[0])

    # Specify the path of the image you want to delete
    image_path = 'images/'+Image_name[0]  # Change this to your image path

    # Create a blob reference to the image
    blob = bucket.blob(image_path)

    # Delete the image
    blob.delete()

    print(f'File {image_path} deleted successfully.')
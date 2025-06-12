import urllib.request
import ultralytics
from Catch_Segment import Catch_Segment
from ultralytics import YOLO
#-------------------------------------------------------
model = YOLO("runs/segment/train/weights/best.pt")

def Download_image(url,data):
    filename = "Main_Image/1.jpg"

    urllib.request.urlretrieve(url, filename)
 
    image_path = 'Main_Image/1.jpg'

    results = model.predict(source=image_path, conf=0.25)

    for result in results:
        boxes = result.boxes

    Catch_Segment(0,boxes,image_path,data)
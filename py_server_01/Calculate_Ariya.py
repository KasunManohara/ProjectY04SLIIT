import urllib.request

from IPython.display import display, Image
import cv2
import numpy as np
import matplotlib.pyplot as plt


from scipy import ndimage as nd
from PIL import Image
from Threshold_value import Threshold_value

#-------------------------------------------------------


def Calculate_Ariya(Ariya,data):
    # Load the image
    image_path = "Sharpened_Image/sharpened_image.jpg"
    image = Image.open(image_path)
    
    # Convert the image to RGB (if it's not already)
    image = image.convert("RGB")
    
    # Define the target color (R, G, B)
    target_color = (254, 254, 254)  # Example: Red
    
    # Get image size
    width, height = image.size
  
    # Initialize pixel count for the target color
    color_pixel_count = 0
    
    # Iterate over the image's pixels
    for x in range(width):
        for y in range(height):
            pixel = image.getpixel((x, y))
          #  print(pixel)
            if pixel == target_color:
                color_pixel_count += 1
    
    # Calculate area (assuming each pixel is one unit of area)
    total_area = color_pixel_count

    Affected_Ariya_pr = (Ariya*100)/((width*height)-total_area)


     
    Threshold_value(round(Affected_Ariya_pr, 2),data)

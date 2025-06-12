
import cv2
import numpy as np
import tensorflow as tf
from skimage import io, measure
from skimage.color import label2rgb
from scipy import ndimage as nd
from PIL import Image
from matplotlib import pyplot as plt
import matplotlib as mpl
from sklearn.cluster import KMeans

from Calculate_Ariya import Calculate_Ariya

#-------------------------------------------------------
def Detect_Affected(data):

    img = io.imread('Sharpened_Image/sharpened_image.jpg')
    Main_im = io.imread('Main_Image/1.jpg')
    # Convert the image from RGB to HSV color space
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    
    # Create a mask for a specific color range in HSV
    mask = cv2.inRange(hsv, (30, 90, 90), (120, 255, 255))
    
    # Apply binary closing to the mask to fill small holes
    closed_mask = nd.binary_closing(mask, np.ones((7, 7)))
    
    # Label connected components in the closed mask
    label_image = measure.label(closed_mask)
    
    # Get properties of labeled regions
    props = measure.regionprops_table(label_image, img, properties=['label', 'area'])
    
    # Check if there are any labeled regions
    if len(props['label']) > 0:
        # Find the index of the largest region by area
        largest_region_index = np.argmax(props['area'])
        largest_label = props['label'][largest_region_index]
    
        # Create a mask for only the largest region
        largest_mask = np.where(label_image == largest_label, 1, 0).astype(np.uint8)
    
        # Overlay the largest region on the original image using label2rgb
        image_l_o = label2rgb(largest_mask, image=Main_im)
        # Save the resulting image
        output_filename = 'Detect_Affected/Affected_region_overlay.png'
        plt.imsave(output_filename, image_l_o)


        Calculate_Ariya(props['area'][largest_region_index],data)
    else:
        print("No data found.")

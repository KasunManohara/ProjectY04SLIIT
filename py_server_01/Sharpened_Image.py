
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
from IPython.display import display, Image
import cv2
import numpy as np


from matplotlib import pyplot as plt



#-------------------------------------------------------
from Detect_Affected import Detect_Affected


def Sharpened_Image(data):

    
    # Step 1: Read the Image
    original = cv2.imread('Colour_Cluster/im.png', cv2.IMREAD_UNCHANGED)
    
    # Step 2: Define the Sharpening Kernel
    sharpen_filter = np.array([[-1, -1, -1],
                                [-1,  9, -1],
                                [-1, -1, -1]])
    
    # Step 3: Apply the Sharpening Filter
    sharp_image = cv2.filter2D(original, -1, sharpen_filter)
    
    # Step 4: Save the Sharpened Image
    cv2.imwrite('Sharpened_Image/sharpened_image.jpg', sharp_image)
    
    # Step 5: Display the Images
 #   plt.figure(figsize=(10, 5))
    
    

    Detect_Affected(data) 

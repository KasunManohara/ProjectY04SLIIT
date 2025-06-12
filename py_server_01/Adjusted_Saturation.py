
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from skimage import io, measure
from matplotlib import pyplot as plt
from Colour_Cluster import Colour_Cluster


#-------------------------------------------------------


def Adjusted_Saturation(data):

    
    # Load an image as a tensor
    image = tf.io.read_file('removebg/582.jpg')
    image = tf.image.decode_jpeg(image)
    
    # Adjust saturation (saturation_factor > 1 increases saturation)
    adjusted_image = tf.image.adjust_saturation(image, 10.0)  # Double the saturation
    
    # Convert back to uint8 and save or display
    adjusted_image = tf.cast(adjusted_image, tf.uint8)
    tf.io.write_file('Incresesaturation/101.jpg', tf.image.encode_jpeg(adjusted_image))
    
    
  
    Colour_Cluster(data)
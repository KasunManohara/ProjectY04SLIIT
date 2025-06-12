import urllib.request
import ultralytics
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
from IPython.display import display, Image
import cv2
import matplotlib.pyplot as plt
from matplotlib import pyplot as plt
import matplotlib as mpl
from sklearn.cluster import KMeans
from Sharpened_Image import Sharpened_Image
#-------------------------------------------------------



def Colour_Cluster(data):

    image = mpl.image.imread("Incresesaturation/101.jpg")
  #  plt.imshow(image)
    
    X = image.reshape(-1,3)
    kmean = KMeans(n_clusters=25, n_init=10)
    kmean.fit(X)
    S_i = kmean.cluster_centers_[kmean.labels_]
    S_i = S_i.reshape(image.shape)
  #  plt.imshow(S_i/255)
    cv2.imwrite("Colour_Cluster/im.png",cv2.cvtColor(S_i.astype("uint8"),cv2.COLOR_RGB2BGR))
    Sharpened_Image(data)

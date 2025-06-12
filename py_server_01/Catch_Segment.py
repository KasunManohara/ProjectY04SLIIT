import urllib.request
import ultralytics
import cv2
import numpy as np
import matplotlib.pyplot as plt
from ultralytics import YOLO
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
from scipy import ndimage as nd
from matplotlib import pyplot as plt
from Show_mask import show_mask
from Adjusted_Saturation import Adjusted_Saturation
model = YOLO("runs/segment/train/weights/best.pt")
sam_checkpoint = "sam_vit_h_4b8939.pth"
model_type = "vit_h"
sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
predictor = SamPredictor(sam)

def Catch_Segment(part,boxes,image_path,data):
    bbox=boxes.xyxy.tolist()[0]

    image = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    
    predictor.set_image(image)
    
    input_box = np.array(bbox)
    
    masks, _, _ = predictor.predict(
        point_coords=None,
        point_labels=None,
        box=input_box[None, :],
        multimask_output=False,
    )
    #-----------------------------------------
    # plt.figure(figsize=(10, 10))
    # plt.imshow(image)
    #         # Save the resulting image

    # show_mask(masks[0], plt.gca())
    # plt.savefig('generated_mask_image.png', bbox_inches='tight', pad_inches=0)
    # plt.axis('off')
    # plt.show()
    #-----------------------------------------
  
    segmentation_mask = masks[0]
    binary_mask = np.where(segmentation_mask > 0.5, 1, 0)
    
    white_background = np.ones_like(image) * 255
    
    new_image = white_background * (1 - binary_mask[..., np.newaxis]) + image * binary_mask[..., np.newaxis]
    
    
    #plt.imshow(new_image.astype(np.uint8))
    new_image = new_image.astype(np.uint8)
    cv2.imwrite('removebg/582.jpg', cv2.cvtColor(new_image, cv2.COLOR_RGB2BGR))

    Adjusted_Saturation(data)  

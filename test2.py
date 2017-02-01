from PIL import Image
import cv2,json,os
import numpy as np

image_name = "./croped_images/SPORTS/528_1.png"
image_nb = "528"
picture = Image.open(image_name)
rgb_im = picture.convert('RGB')
#print(picture)
# Get the size of the image
width, height = picture.size


for x in range(width):
    for y in range(height):
        #print x,y
        r,g,b = rgb_im.getpixel((x,y))
        if(r,g,b) == (35,31,32):
            rgb_im.putpixel((x,y),(255,255,255))
        else :
            rgb_im.putpixel((x,y),(0,0,0))

#cv2.imshow("test",rgb_im)
rgb_im.save("test2.png")

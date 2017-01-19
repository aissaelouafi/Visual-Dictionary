#!/usr/bin/python
# -*- coding: utf-8 -*-
import cv2,json,os
from PIL import Image
import numpy as np
from matplotlib import pyplot as plt

img=cv2.imread('./split_image_example.png',0)
if img is None:
    sys.exit("No input image") #good practice

#thresholding your image to keep all but the background (I took a version of your
#image with a white background, you may have to adapt the threshold
thresh=cv2.threshold(img, 250, 252, cv2.THRESH_BINARY_INV);
img = thresh[1]
cv2.imwrite("testsplited.png",img)
res=thresh[1]

#dilating the result to connect all small components in your image
kernel=cv2.getStructuringElement(cv2.MORPH_CROSS,(3,3))
for i in range(10):
    res=cv2.dilate(res,kernel)

cv2.imwrite("testsplited2.png",img)

#Finding the contours
img2,contours = cv2.findContours(res,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
cpt=0
for contour in contours:
    #finding the bounding rectangle of your contours
    rect=cv2.boundingRect(contour)
    #cropping the image to the value of the bounding rectangle
    img2=img[rect[1]:rect[1]+rect[3],rect[0]:rect[0]+rect[2]]
    cv2.imwrite("./images/"+str(cpt)+".png", img2)
    cpt=cpt+1;

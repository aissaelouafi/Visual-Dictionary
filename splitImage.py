#!/usr/bin/python
# -*- coding: utf-8 -*-
import cv2,json,os,glob,sys,re
from PIL import Image
from shutil import copyfile
import shutil
import numpy as np
from matplotlib import pyplot as plt

rootdir = "images"

for path, dirs, files in os.walk(rootdir):
    for name in files:
        extension = os.path.splitext(name)[1]
        if(extension == ".png"):
            image_nb = name.replace(".png","")
            image_name = os.path.join(path, name)

            img=cv2.imread(image_name,0)
            original_image = cv2.imread(image_name)
            if img is None:
                sys.exit("No input image") #good practice

            #thresholding your image to keep all but the background (I took a version of your
            #image with a white background )
            thresh=cv2.threshold(img, 250, 252, cv2.THRESH_BINARY_INV);
            img = thresh[1]
            cv2.imwrite("binary_treshold_output.png",img)
            res=thresh[1]

            #dilating the result to connect all small components in your image
            kernel=cv2.getStructuringElement(cv2.MORPH_CROSS,(3,3))
            for i in range(10):
                res=cv2.dilate(res,kernel)

            #cv2.imwrite("testsplited2.png",img)


            #Finding the contours
            contours, hierarchy = cv2.findContours(res,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)


            cpt=0
            for contour in contours:
                #finding the bounding rectangle of your contours
                rect = cv2.minAreaRect(contour)
                box = cv2.cv.BoxPoints(rect)
                box = np.int0(box)

                W = rect[1][0]
                H = rect[1][1]

                Xs = [i[0] for i in box]
                Ys = [i[1] for i in box]
                x1 = min(Xs)
                x2 = max(Xs)
                y1 = min(Ys)
                y2 = max(Ys)

                #cv2.drawContours(original_image,[box],0,(0,0,255),2)
                #cv2.imwrite("contours_image.png",original_image)

                img2=original_image[y1:y2,x1:x2]
                height, width, channels = img2.shape
                original_height, original_width, channels = original_image.shape
                if(height > 20 and width > 20):
                    croped_image_name = "./croped_images/"+path.replace("images/","")+"/"+str(image_nb)+"_"+str(cpt)+".png"
                    cv2.imwrite(croped_image_name,img2)
                    print(croped_image_name+" created successfuly ...")
                    cpt=cpt+1;

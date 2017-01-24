import cv2,json,os
import numpy as np


image_name = "./images/SPORTS/557.png"
image_nb = "557"
img = cv2.imread(image_name)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray,50,150,apertureSize = 3)
minLineLength = 600
maxLineGap = 600
lines = cv2.HoughLinesP(edges,1,np.pi/180,100,minLineLength,maxLineGap)
for x1,y1,x2,y2 in lines[0]:
    cv2.line(img,(x1,y1),(x2,y2),(0,255,0),2)
    print("file : "+image_nb+"_hough.png created successfuly !! ")
    item = {"image":image_nb,"x1":str(x1),"x2":str(x2),"y1":str(y1),"y2":str(y2)}
    print(item)
cv2.imshow("test",img)
cv2.imwrite("./images/"+image_nb+"_hough"+".png",img)

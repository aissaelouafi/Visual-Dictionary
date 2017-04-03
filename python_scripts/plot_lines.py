from PIL import Image
import cv2,json,os
import numpy as np

image_name = "./croped_images/SPORTS/526_3.png"
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


img = cv2.imread("binary_treshold_output.png")
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(img,50,150,apertureSize = 3)
minLineLength = 10
maxLineGap = 50
lines = cv2.HoughLinesP(edges,1,np.pi/180,100,minLineLength,maxLineGap)
for x1,y1,x2,y2 in lines[0]:
    cv2.line(img,(x1,y1),(x2,y2),(0,255,0),2)
    print("file : "+image_nb+"_hough.png created successfuly !! ")
    #item = {"image":image_nb,"x1":str(x1),"x2":str(x2),"y1":str(y1),"y2":str(y2)}
cv2.imwrite("test2_hough.png",img)

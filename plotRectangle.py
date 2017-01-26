import glob,os,html2text,sys,re,json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import numpy as np


text_cordinates = open("text_cordinates.json","r")
rectangle_cordinate = open("image_split_rectangle.json","r")


text_cordinates = json.load(text_cordinates)
rectangle_cordinate = json.load(rectangle_cordinate)

image_nb = 551

size = 552, 666
im = Image.open('./images/SPORTS/'+str(image_nb)+'.png')
im.thumbnail(size, Image.ANTIALIAS)
# Create figure and axes
fig,ax = plt.subplots(1)

# Display the image
ax.imshow(im)

for i in xrange(len(text_cordinates)):
        if(text_cordinates[i]["page"] == image_nb):
            rect = patches.Rectangle((text_cordinates[i]["startingx"],666-text_cordinates[i]["endingy"]),text_cordinates[i]["endingx"]-text_cordinates[i]["startingx"],text_cordinates[i]["endingy"]-text_cordinates[i]["startingy"],linewidth=1,edgecolor='r',facecolor='none')
            ax.add_patch(rect)

for j in xrange(len(rectangle_cordinate)):
        if(rectangle_cordinate[j]["image"] == image_nb):
            print(rectangle_cordinate[j])
            xscale = 552/1106
            yscale = 666/1332
            #print(xscale)
            rect = patches.Rectangle((rectangle_cordinate[j]["x1"]*0.5,rectangle_cordinate[j]["y1"]*0.5),(rectangle_cordinate[j]["x2"]-rectangle_cordinate[j]["x1"])*0.5,(rectangle_cordinate[j]["y2"]-rectangle_cordinate[j]["y1"])*0.5,linewidth=2,edgecolor='b',facecolor='none')
            ax.add_patch(rect)

plt.show()
savefig('legend_cordinates_'+str(image_nb)+'.png')

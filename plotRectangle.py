import glob,os,html2text,sys,re,json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import numpy as np


text_cordinates = open("text_cordinates.json","r")
text_cordinates = json.load(text_cordinates)
size = 552, 666
im = Image.open('./images/SPORTS/544.png')
im.thumbnail(size, Image.ANTIALIAS)
# Create figure and axes
fig,ax = plt.subplots(1)

# Display the image
ax.imshow(im)

for i in xrange(len(text_cordinates)):
    print(text_cordinates[i])
    if(text_cordinates[i]["page"] == 544):
        rect = patches.Rectangle((text_cordinates[i]["startingx"],666-text_cordinates[i]["endingy"]),text_cordinates[i]["endingx"]-text_cordinates[i]["startingx"],text_cordinates[i]["endingy"]-text_cordinates[i]["startingy"],linewidth=1,edgecolor='r',facecolor='none')
        ax.add_patch(rect)

plt.show()
savefig('image544_cordinate.png')

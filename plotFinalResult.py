import glob,os,html2text,sys,re,json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import numpy as np


legend_cordinates = open("splited_images_legend.json","r")

image_nb = "531_9"

#size = 552, 666
im = Image.open('./croped_images/SPORTS/'+str(image_nb)+'.png')
#im.thumbnail(size, Image.ANTIALIAS)
fig,ax = plt.subplots(1)
ax.imshow(im)

legend_cordinates = json.load(legend_cordinates)


for i in xrange(len(legend_cordinates)):
        if(legend_cordinates[i]["image"] == image_nb+".png"):
            print(legend_cordinates[i])

            #rect = patches.Rectangle((x1,y1),(x2-x1),(y2-y1),linewidth=1,edgecolor='b',facecolor='none')

            rect = patches.Rectangle((legend_cordinates[i]["x"],legend_cordinates[i]["y"]),legend_cordinates[i]["width"],legend_cordinates[i]["height"],linewidth=1,edgecolor='b',facecolor='none')
            ax.add_patch(rect)
plt.show()

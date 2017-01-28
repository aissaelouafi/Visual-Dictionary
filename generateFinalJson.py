import glob,os,html2text,sys,re,json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import numpy as np


text_cordinates = open("text_cordinates.json","r")
rectangle_cordinate = open("image_split_rectangle.json","r")
splited_images_legend_file = open("splited_images_legend.json","w")

splited_images_legend = []

text_cordinates = json.load(text_cordinates)
rectangle_cordinate = json.load(rectangle_cordinate)

image_nb = 554

rootdir = "croped_images"



for path, dirs, files in os.walk(rootdir):
    for name in files:
        extension = os.path.splitext(name)[1]
        if(extension == ".png"):
            image_nb = name.replace(".png","")
            head, sep, tail = image_nb.partition('_')
            image_nb = int(head)
            image_name = os.path.join(path, name)


            size = 552, 666
            im = Image.open(image_name)
            im.thumbnail(size, Image.ANTIALIAS)
            # Create figure and axes
            #fig,ax = plt.subplots(1)

            # Display the image
            #ax.imshow(im)

            #for i in xrange(len(text_cordinates)):
            #        if(text_cordinates[i]["page"] == image_nb):
            #            #line = patches.Lone
            #            rect = patches.Rectangle((text_cordinates[i]["startingx"],666-text_cordinates[i]["endingy"]),text_cordinates[i]["endingx"]-text_cordinates[i]["startingx"],text_cordinates[i]["endingy"]-text_cordinates[i]["startingy"],linewidth=1,edgecolor='r',facecolor='none')
            #            ax.add_patch(rect)

            for j in xrange(len(rectangle_cordinate)):
                    if(rectangle_cordinate[j]["image"] == image_nb):
                        #print(rectangle_cordinate[j])
                        #print(xscale)
                        x1 = rectangle_cordinate[j]["x1"]*0.5
                        x2 = rectangle_cordinate[j]["x2"]*0.5

                        y1 = rectangle_cordinate[j]["y1"]*0.5
                        y2 = rectangle_cordinate[j]["y2"]*0.5

                        #rect = patches.Rectangle((x1,y1),(x2-x1),(y2-y1),linewidth=1,edgecolor='b',facecolor='none')




                        for i in xrange(len(text_cordinates)):
                            if(text_cordinates[i]["page"] == image_nb):
                                width = x2-x1
                                height = y2-y1



                                text_width = text_cordinates[i]["endingx"]-text_cordinates[i]["startingx"]
                                text_height = text_cordinates[i]["endingy"]-text_cordinates[i]["startingy"]


                                xpoint = (text_cordinates[i]["startingx"])+text_width
                                ypoint = (666-text_cordinates[i]["endingy"])+text_height



                                xrelatif = text_cordinates[i]["endingx"]-x2
                                yrelatif = text_cordinates[i]["endingy"]-y2



                                #We would check if the point is inside the rectangle or not
                                if(x1 < xpoint < x1+width and y1 < ypoint < y1 + height):
                                    print("Exploring : "+str(image_name)+" ... ")
                                    #print("The point ( "+str(xpoint)+","+str(ypoint)+" ) is inside the rectangle :"+str(rectangle_cordinate[j]["cpt"])+" ( "+str(x1)+","+str(y1)+" ) width "+str(width)+" and height "+str(height)+"The legend is : "+text_cordinates[i]["text"])
                                    xrelatif = xpoint-x1
                                    yrelatif = ypoint-y1

                                    final_point = (xrelatif,yrelatif)
                                    #print("last point ")
                                    #print(final_point)


                                    item = {"x":(xrelatif-text_width)*2,"y":(yrelatif-text_height)*2,"image":""+str(image_nb)+"_"+str(rectangle_cordinate[j]["cpt"])+".png","height":text_height*2,"width":text_width*2,"legend":text_cordinates[i]["text"]}
                                    splited_images_legend.append(item)

                        #ax.add_patch(rect)

            #plt.show()

with splited_images_legend_file as json_write_file:
    json_write_file.write(json.dumps(splited_images_legend))
    print("file : splited_images_legend.json created successfuly ...")

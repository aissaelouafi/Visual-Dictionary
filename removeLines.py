from PIL import Image
import cv2,json,os,glob,sys,re
import shutil


rootdir = "images"
for path, dirs, files in os.walk(rootdir):
    for name in files:
        extension = os.path.splitext(name)[1]
        if(extension == ".png"):
            image_nb = name.replace(".png","")
            image_name = os.path.join(path, name)

            picture = Image.open(image_name)
            #print(picture)
            # Get the size of the image
            width, height = picture.size


            # Process every pixel
            for x in range(width):
               for y in range(height):
                   if(y < 52):
                       picture.putpixel((x,y),(253,252,252))
                       current_color = picture.getpixel( (x,y) )
                       #print("color replaced \n");

                   if(y > 1280):
                        picture.putpixel((x,y),(253,252,252))
                        current_color = picture.getpixel( (x,y) )
                        #print("color replaced \n");

                   image_nb = int(image_nb)
                   #print(image_nb)
                   #if(image_nb %2 == 0):
                   if(x > 1060):
                      #print("pair")
                       picture.putpixel((x,y),(253,252,252))
                       current_color = picture.getpixel( (x,y) )
                       #print("color replaced \n");

                    ## Page paire
                   #else:
                   if(x < 44):
                      picture.putpixel((x,y),(253,252,252))
                      current_color = picture.getpixel( (x,y) )
                            #print("color replaced \n");


            picture.save(image_name)
            print("image :"+image_name+" successfuly created ...")

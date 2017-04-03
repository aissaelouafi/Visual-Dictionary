#The goal is to rename the image number (hexa to decimal) and associate topic to each image
import glob,os

rootdir = 'images'
for file in os.listdir(rootdir):
    extension = os.path.splitext(file)[1]
    if(extension == ".png"):
        oldName = file
        file = file.replace("bg","")
        file = file.replace(".png","")
        decimalValue = str(int(file,16))
        newImageName = decimalValue+".png"
        os.rename("images/"+oldName,"images/"+newImageName)
        print("Image modified from : "+oldName+" To : "+newImageName)

#Script to replace the white background by trasnparent background
from PIL import Image

img = Image.open('./images/SPORTS/546.png')
img = img.convert("RGBA")
datas = img.getdata()

newData = []
dataWithoutBackground = []
for item in datas:
    #print(item)
    if item[0] == 253 and item[1] == 252 and item[2] == 252:
        newData.append((255, 255, 255, 0))
    else:
        dataWithoutBackground.append(item)
        newData.append(item)

print("The pixel nb of the image : "+str(len(newData)))
print("Compoared to the pixel number of the real page : "+str(1106*1332))
print("After the trasnparent background suppression : "+str(len(dataWithoutBackground)/len(newData)))
img.putdata(newData)
img.show()
img.save("split_image_example.png", "PNG")

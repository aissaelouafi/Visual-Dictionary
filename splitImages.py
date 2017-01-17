#Script to replace the white background by trasnparent background
from PIL import Image

img = Image.open('./images/THE UNIVERSE/27.png')
img = img.convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    #print(item)
    if item[0] == 253 and item[1] == 252 and item[2] == 252:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save("split_image_example.png", "PNG")

from PIL import Image
import cv2
picture = Image.open("./images/SPORTS/558.png")
print(picture)
# Get the size of the image
width, height = picture.size

print(width)

# Process every pixel
for x in range(width):
   for y in range(height):
       if(y < 52):
           picture.putpixel((x,y),(253,252,252))
           current_color = picture.getpixel( (x,y) )
           print("color replaced \n");

       if(y > 1282):
            picture.putpixel((x,y),(253,252,252))
            current_color = picture.getpixel( (x,y) )
            print("color replaced \n");

       if(x > 1062):
            picture.putpixel((x,y),(253,252,252))
            current_color = picture.getpixel( (x,y) )
            print("color replaced \n");



picture.save("sansTrait.png")
       ####################################################################
       # Do your logic here and create a new (R,G,B) tuple called new_color
       ####################################################################
       #print(current_color)
       #if(current_color == (119,116,116)):
          # print("ok")
           #picture.putpixel( (x,y), new_color)

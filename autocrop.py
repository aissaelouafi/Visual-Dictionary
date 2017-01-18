    # Get the bounding box
from PIL import Image
border = 0
image = Image.open('./images/THE UNIVERSE/27.png')


bbox = image.getbbox()

    # Crop the image to the contents of the bounding box
image = image.crop(bbox)

    # Determine the width and height of the cropped image
(width, height) = image.size

    # Add border
width += border * 2
height += border * 2

    # Create a new image object for the output image
cropped_image = Image.new("RGBA", (width, height), (0,0,0,0))

    # Paste the cropped image onto the new image
cropped_image.paste(image, (border, border))

    # Done!
print(cropped_image)

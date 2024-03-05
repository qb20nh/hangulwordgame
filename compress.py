import os
import glob

from PIL import Image

def find_image_files():
    current_dir = os.path.dirname(os.path.realpath(__file__))
    image_files = glob.glob(current_dir + '/images/wordsets/*/original/*')
    return image_files

for file in find_image_files():
    file_name = os.path.basename(file)
    print(file_name)
    # crop the image to the square aspect ratio
    img = Image.open(file)
    width, height = img.size

    # Determine the size difference and calculate the crop dimensions
    if width > height:
        # If the image is wider than it is tall
        offset = (width - height) // 2
        crop_square = (offset, 0, width - offset, height)
    else:
        # If the image is taller than it is wide
        offset = (height - width) // 2
        crop_square = (0, offset, width, height - offset)

    # Crop to the largest centered square
    img = img.crop(crop_square)

    # Resize the image to 64x64 using bicubic resampling
    img = img.resize((64, 64), Image.BICUBIC)

    # Save the image as JPEG with 50% quality
    base_name = os.path.basename(file).rsplit('.', 1)[0] + '.webp'
    output_file = os.path.join(os.path.dirname(file), '..', base_name)
    img.save(output_file, 'WEBP', quality=50)


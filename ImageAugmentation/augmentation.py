import albumentations as A
import numpy as np
from PIL import Image

# augmentation pipeline
transform = A.Compose([
    A.RandomRotate90(p=0.5),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.5),
    A.RandomBrightnessContrast(p=0.2),
    A.ElasticTransform(alpha=1, sigma=50, p=0.5),
])

def augment_image(image):
    image_np = np.array(image)
    augmented = transform(image=image_np)
    augmented_image = augmented['image']
    return Image.fromarray(augmented_image)

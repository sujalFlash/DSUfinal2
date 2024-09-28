from django.urls import path
from .rest_view import ImageAugmentationView

urlpatterns = [
    path('api/image_augmentation/augment/', ImageAugmentationView.as_view(), name='image_augment'),
]

from django.urls import path
from .rest_view import ImageProcessingView
urlpatterns=[
 path('api/image_processing/', ImageProcessingView.as_view(), name='image_processing'),
]
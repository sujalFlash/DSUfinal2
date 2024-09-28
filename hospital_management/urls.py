from django.urls import path
from .rest_view import list_hospitals

urlpatterns = [
    path('hospitals/', list_hospitals, name='list_hospitals'),
]

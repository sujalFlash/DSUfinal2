# urls.py
from django.urls import path
from .rest_view import predict_cancer,feedback

urlpatterns = [
    path('api/rl/predict/', predict_cancer, name='predict'),
    path('api/rl/predict/feedback/',feedback, name='feedback'),
]
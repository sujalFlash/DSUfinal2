from django.urls import path
from .views import PredictCancerView

urlpatterns = [
    path('api/predict/', PredictCancerView.as_view(), name='predict'),
]

from django.urls import path

from .rest_view import update_disease_history
from .rest_view import create_disease,disease_history_view,facilities_list
urlpatterns = [

 path('disease-history/<int:pk>/', update_disease_history, name='update_disease_history'),
path('api/add_disease/',create_disease,name='create_disease'),
path('api/view_diesease_history/',disease_history_view,name='distory_history_view'),
path('view_facilities/',facilities_list,name='facilities_list')
]

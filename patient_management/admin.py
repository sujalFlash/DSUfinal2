from django.contrib import admin
from .models import Disease
from .models import DiseaseHistory
from .models import Image
from .models import Patient
admin.site.register(Patient)
admin.site.register(Disease)
admin.site.register(DiseaseHistory)
admin.site.register(Image)
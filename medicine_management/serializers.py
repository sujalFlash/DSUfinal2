from rest_framework import serializers
from .models import Medicines
class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicines
        fields = ['id', 'brand_name','hospital','chemical_name','manufacturer_company_name','manufacturing_date','expiry_date','is_expired']
class MedicineCreateSerializer(serializers.ModelSerializer):
    pass

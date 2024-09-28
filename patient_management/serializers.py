from rest_framework import serializers
from .models import DiseaseHistory,Disease

class DiseaseHistorySerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    class Meta:
        model = DiseaseHistory
        fields = ['id', 'patient_name', 'disease_name', 'hospital_name', 'date_diagnosed', 'status', 'severity','is_admitted']


class DiseaseHistoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseHistory
        fields = ['status', 'severity','is_admitted']

    def validate_status(self, value):
        # Ensure that the status is either 'active' or 'healed'
        if value not in ['active', 'healed']:
            raise serializers.ValidationError("Invalid status. Choose either 'active' or 'healed'.")
        return value

    def validate_severity(self, value):
        # Ensure that the severity is one of the valid choices
        valid_severities = [choice[0] for choice in DiseaseHistory.SEVERITY_CHOICES]
        if value not in valid_severities:
            raise serializers.ValidationError("Invalid severity. Choose a valid option.")
        return value
class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = ['id', 'name','hospital','facilities']
# patient/models.py (in the Patient Management app)
import fs
from django.db import models
from hospital_management.models import Hospital

class GenderChoices(models.TextChoices):
    MALE = 'M', 'Male'
    FEMALE = 'F', 'Female'
    OTHER = 'O', 'Other'

class Disease(models.Model):
    name = models.CharField(max_length=200)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE,default=2)
    facilities=models.TextField(null=True,blank=True)

    class Meta:
        unique_together = ('name', 'hospital')  # Ensures name + hospital combination is unique

    def __str__(self):
        return f"{self.name}:{self.hospital}"
class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    contact_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GenderChoices.choices, default=GenderChoices.MALE)
    disease_detected = models.BooleanField(default=False)
    diseases = models.ManyToManyField(Disease, through='DiseaseHistory')
    is_admitted=models.BooleanField(default=False)


    def __str__(self):
        return self.name

    def get_disease_status(self):
        return "Yes" if self.disease_detected else "No"
import os
from django.conf import settings


class SeverityChoices(models.TextChoices):
    MILD = 'M', 'Mild'
    MODERATE = 'MO', 'Moderate'
    SEVERE = 'S', 'Severe'


class DiseaseHistory(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('healed', 'Healed'),
    ]

    SEVERITY_CHOICES = SeverityChoices.choices
    patient =models.ForeignKey(Patient,on_delete=models.CASCADE, related_name='disease_history')
    disease =models.ForeignKey(Disease,on_delete=models.CASCADE, related_name='disease_history')
    hospital=models.ForeignKey(Hospital,on_delete=models.CASCADE, related_name='disease_history')
    date_diagnosed=models.DateField()
    status=models.CharField(max_length=10,choices=STATUS_CHOICES, default='active')
    severity=models.CharField(max_length=2, choices=SEVERITY_CHOICES,
                                default=SeverityChoices.MILD)
    is_admitted=models.BooleanField(default=False)
    def __str__(self):
        return f"{self.disease.name} (Patient: {self.patient.name}, Hospital: {self.hospital.name}, Severity: {self.get_severity_display()})"

    def get_image_path(self):
        # Returns the absolute path of the image file
        return os.path.join(settings.MEDIA_ROOT, self.image_file.name)


class Image(models.Model):
    disease_history = models.ForeignKey('DiseaseHistory', on_delete=models.CASCADE, related_name='images')

    # Store the path of the image file
    image_path = models.CharField(max_length=255,default=None)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Example of how you might handle file saving manually
        if hasattr(self, 'image_file') and self.image_file:
            # Save file to the custom location
            file_name = os.path.basename(self.image_file.name)
            self.image_path = fs.save(file_name, self.image_file)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.disease_history}"

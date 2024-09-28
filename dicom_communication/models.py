
from django.db import models
class DICOMFile(models.Model):
    file = models.FileField(upload_to='dicom_files/')
    patient_id = models.CharField(max_length=100)
    study_instance_uid = models.CharField(max_length=100)
    modality = models.CharField(max_length=50)  # E.g., 'CT', 'X-Ray'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"DICOM File for Patient {self.patient_id} (Modality: {self.modality})"


from django.db import models

class ImageFeedback(models.Model):
    image_path = models.CharField(max_length=255,null=True,blank=True)
    user_feedback = models.CharField(max_length=10,null=True,blank=True)  # 'correct' or 'incorrect'
    correct_label = models.CharField(max_length=10, null=True, blank=True)  # Only if feedback is 'incorrect'

    def __str__(self):
        return f"Feedback for image {self.image_path}"
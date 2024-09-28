from django.shortcuts import get_object_or_404
from django.http import FileResponse
from .models import DICOMFile
from django.shortcuts import render
def retrieve_dicom_file(request, dicom_id):
    dicom_file = get_object_or_404(DICOMFile, id=dicom_id)
    response = FileResponse(open(dicom_file.file.path, 'rb'))
    return response



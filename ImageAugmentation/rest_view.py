import pydicom
from PIL import Image
import numpy as np
import io

from rest_framework.decorators import permission_classes, api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from .augmentation import augment_image
from .serializers import ImageUploadSerializer

from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view, permission_classes

class ImageAugmentationView(APIView):
    http_allowed_methods=['POST']
    permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']

            try:
                # Read DICOM file using pydicom
                dicom_file = pydicom.dcmread(image_file)

                # Extract the image array (pixel data) from the DICOM file
                image_array = dicom_file.pixel_array

                # Convert numpy array to PIL Image for augmentation
                image = Image.fromarray(image_array)

                # Perform augmentation
                augmented_image = augment_image(image)

                # Convert augmented image to byte stream
                img_byte_arr = io.BytesIO()
                augmented_image.save(img_byte_arr, format='PNG')
                img_byte_arr.seek(0)

                # Create HTTP response with the augmented image
                response = HttpResponse(img_byte_arr.getvalue(), content_type='image/png')
                response['Content-Disposition'] = 'attachment; filename="augmented_image.png"'
                return response

            except Exception as e:
                return Response({'error': f'Error processing DICOM file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

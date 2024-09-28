import pydicom
import numpy as np
from PIL import Image
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageUploadSerializer
import io
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated

class ImageProcessingView(APIView):
    http_allowed_methods=['POST']
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']
            try:
                dicom_data = pydicom.dcmread(image_file)
                image_array = dicom_data.pixel_array
                image = Image.fromarray(image_array)
                normalization = serializer.validated_data.get('normalization', 1.0)
                resize_width = serializer.validated_data.get('resize_width', 256)
                resize_height = serializer.validated_data.get('resize_height', 256)
                image = image.point(lambda p: p * normalization)
                image = image.resize((resize_width, resize_height))
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                img_byte_arr.seek(0)
                response = HttpResponse(img_byte_arr.getvalue(), content_type='image/png')
                response['Content-Disposition'] = 'attachment; filename="processed_image.png"'
                return response

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

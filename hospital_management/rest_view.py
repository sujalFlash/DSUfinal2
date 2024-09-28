from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Hospital
from .serializers import HospitalSerializer

@api_view(['GET'])
def list_hospitals(request):
    hospitals = Hospital.objects.all()
    serializer = HospitalSerializer(hospitals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

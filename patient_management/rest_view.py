from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import DiseaseHistory, Patient, Disease
from .serializers import DiseaseHistorySerializer,DiseaseHistoryUpdateSerializer
from .permissions import IsDoctorOrStaffOrManagerOrNurse
from staff_management.permissions import IsDoctor
from .serializers import DiseaseSerializer
from rest_framework.permissions import IsAuthenticated
from staff_management.models import Doctor,NursingStaff,CleaningStaff,ReceptionStaff,WorkManager

@api_view(['PATCH'])
@permission_classes([IsDoctor])  # Only doctors are allowed to update the disease history
def update_disease_history(request, pk):
    try:
        disease_history = DiseaseHistory.objects.get(pk=pk)
    except DiseaseHistory.DoesNotExist:
        return Response({"detail": "Disease history not found."}, status=status.HTTP_404_NOT_FOUND)
    if disease_history.hospital != request.user.hospital:
        print(disease_history.hospital)
        print(request.user.hospital)
        return Response({"detail": "You do not have permission to update this disease history."},
                        status=status.HTTP_403_FORBIDDEN)
    serializer = DiseaseHistoryUpdateSerializer(disease_history, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import logging

logger = logging.getLogger(__name__)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_disease(request):
    user = request.user
    is_doctor = False
    is_manager = False
    doctor=Doctor.objects.filter(hospital=user.hospital)
    manager=WorkManager.objects.filter(hospital=user.hospital)
    for each_doctor in doctor:
        print(each_doctor.user)
        if each_doctor.user==user:
            is_doctor=True
            break
    for each_manager in manager:
        print(each_manager.user)
        if each_manager.user==user:
            is_manager=True
            break


    if is_doctor or is_manager:
        data = request.data.copy()  # Make a mutable copy of the request data
        data['hospital'] = user.hospital.id
        serializer = DiseaseSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'detail': 'Only doctors or work managers can create diseases.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(["GET"])
def facilities_list(request):
    user=request.user
    diseases=Disease.objects.all()
    serializer = DiseaseSerializer(diseases, many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def disease_history_view(request):
    user = request.user
    hospital=user.hospital
    is_doctor=False
    is_manager=False
    is_nurse=False
    is_reception=False
    doctor=Doctor.objects.filter(hospital=hospital)
    manager=WorkManager.objects.filter(hospital=hospital)
    nurse=NursingStaff.objects.filter(hospital=hospital)
    reception=ReceptionStaff.objects.filter(hospital=hospital)
    for each_doctor in doctor:
        if each_doctor.user==user:
            is_doctor=True
            break
    for each_nurse in nurse:
        if each_nurse.user==user:
            is_nurse=True
            break
    for each_reception in reception:
        if each_reception.user==user:
            is_reception=True
            break
    for each_manager in manager:
        if each_manager.user==user:
            is_manager=True
            break
    if request.method != 'GET':
        return Response({"detail": "You do not have permission to view disease history."},
                        status=status.HTTP_403_FORBIDDEN)
    if is_doctor or is_manager or is_nurse or is_reception:
        disease_history = DiseaseHistory.objects.filter(hospital=hospital)
        serializer = DiseaseHistorySerializer(disease_history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "User does not belong to a hospital."}, status=status.HTTP_403_FORBIDDEN)


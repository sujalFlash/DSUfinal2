from operator import truediv

from rest_framework.permissions import BasePermission
from sympy import false
from staff_management.models import Doctor
from .models import WorkManager
from rest_framework.permissions import BasePermission
class IsHospitalManager(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        is_workManager=False
        manager=WorkManager.objects.filter(hospital=request.user.hospital)
        for each_manager in manager:
            if each_manager.user==request.user:
                is_workManager=True
                break
        return is_workManager

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        is_doctor=False
        doctor=Doctor.objects.filter(hospital=request.user.hospital)
        for each_doctor in doctor:
            if each_doctor.user==request.user:
                is_doctor=True
                break
        return request.user.is_authenticated and is_doctor
class IsManagerOrSuperuser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_superuser or hasattr(request.user, 'manager'))
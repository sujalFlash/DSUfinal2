from rest_framework.permissions import BasePermission
from staff_management.models import Doctor, StaffMember, WorkManager, NursingStaff


class IsDoctorOrStaffOrManagerOrNurse(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        # Check if the user is authenticated
        if not user.is_authenticated:
            return False

        # Check if the user is linked to one of the allowed roles
        is_doctor = Doctor.objects.filter(user=user).exists()
        is_staff_member = StaffMember.objects.filter(user=user).exists()
        is_work_manager = WorkManager.objects.filter(user=user).exists()
        is_nurse = NursingStaff.objects.filter(user=user).exists()

        # Grant permission if the user is linked to one of the roles
        return is_doctor or is_staff_member or is_work_manager or is_nurse

from django.contrib import admin

from django.shortcuts import redirect
from django.contrib.auth.admin import UserAdmin

from .models import Doctor,StaffMember,ReceptionStaff,NursingStaff,CleaningStaff,Department,WorkManager,WorkAssignment
from .models import CustomUser
from django.contrib.admin import AdminSite
admin.site.register(Department)
admin.site.register(Doctor)
admin.site.register(StaffMember)
admin.site.register(ReceptionStaff)
admin.site.register(NursingStaff)
admin.site.register(CleaningStaff)

admin.site.register(WorkManager)
admin.site.register(WorkAssignment)
admin.site.register(CustomUser)
from django.contrib.admin import AdminSite
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
import logging

logger = logging.getLogger(__name__)

class MyAdminSite(AdminSite):
    def login(self, request, extra_context=None):
        print('Admin login attempt for username: %s', request.POST.get('username'))
        response = super().login(request, extra_context)

        # Log after login attempt
        if request.user.is_authenticated:
            print('Login successful for user: %s', request.user.username)
        else:
            print('Login failed for username: %s', request.POST.get('username'))

        return response
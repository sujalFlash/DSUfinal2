from django.contrib.auth.hashers import make_password
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from hospital_management.models import Hospital
from django.contrib.auth.hashers import make_password
class Department(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="departments")

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'hospital')
class CustomUser(AbstractUser):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='users', null=True, blank=True)

    def save(self, *args, **kwargs):
        # Hash the password before saving
        if self.pk is None:  # This means it's a new user
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def clean(self):
        role_count = sum([hasattr(self, 'staff_member'), hasattr(self, 'manager')])
        if role_count > 1:
            raise ValidationError("A user can only be a Staff Member or Work Manager, not both.")

    def is_staff_member(self):
        return hasattr(self, 'staff_member')

    def is_work_manager(self):
        return hasattr(self, 'manager')


# StaffMember Model
class StaffMember(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='staff_member')
    employee_id = models.CharField(max_length=10, unique=True, default="not_assigned")
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)  # Role can be specified at the instance level
    shift = models.CharField(max_length=20, choices=[('Day', 'Day'), ('Night', 'Night'), ('Rotating', 'Rotating')], default='Day')
    departments = models.ManyToManyField(Department, related_name="staff_members")
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="staff_members")
    status = models.CharField(max_length=20, choices=[('free', 'Free'), ('working', 'Working'), ('on_leave', 'On Leave')], default='free')
    is_in_hospital = models.BooleanField(default=False)
    on_duty = models.BooleanField(default=False)

    def clean(self):
        super().clean()
        if self.pk:
            user_hospital_departments = self.hospital.departments.all()

            for department in self.departments.all():
                # Ensure the department's hospital matches the CleaningStaff's hospital
                if department not in user_hospital_departments:
                    raise ValidationError(
                        f"Staff hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )

    class Meta:
        unique_together = ('name', 'hospital', 'role')

    def __str__(self):
        return self.name


# Doctor Model (inherits from StaffMember)
class Doctor(StaffMember):
    specialization = models.CharField(max_length=255)
    def clean(self):
        if self.pk:
            user_hospital_departments = self.hospital.departments.all()

            for department in self.departments.all():
                # Ensure the department's hospital matches the CleaningStaff's hospital
                if department not in user_hospital_departments:
                    raise ValidationError(
                        f"Doctor hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )
    def __str__(self):
          return f"{self.name}:{self.specialization}:{self.hospital}"


# NursingStaff Model (inherits from StaffMember)
class NursingStaff(StaffMember):
    qualifications = models.CharField(max_length=255, null=True, blank=True)
    def clean(self):
        super().clean()
        if self.pk:
            user_hospital_departments = self.hospital.departments.all()

            for department in self.departments.all():
                # Ensure the department's hospital matches the CleaningStaff's hospital
                if department not in user_hospital_departments:
                    raise ValidationError(
                        f"Nurse hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )

    def __str__(self):
        return f"Nurse: {self.name}"


# ReceptionStaff Model (inherits from StaffMember)
class ReceptionStaff(StaffMember):
    desk_assigned = models.CharField(max_length=255, null=True, blank=True)

    def clean(self):
        super().clean()
        if self.pk:
            user_hospital_departments = self.hospital.departments.all()

            for department in self.departments.all():
                if department not in user_hospital_departments:
                    raise ValidationError(
                        f"Reception hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )

    def __str__(self):
        return f"Receptionist: {self.name}"


# CleaningStaff Model (inherits from StaffMember)
class CleaningStaff(StaffMember):
    area_assigned = models.CharField(max_length=255, null=True, blank=True)

    def clean(self):
        if self.pk:
            user_hospital_departments = self.hospital.departments.all()

            for department in self.departments.all():
                # Ensure the department's hospital matches the CleaningStaff's hospital

                if department not in user_hospital_departments:
                    raise ValidationError(
                        f"Cleaning staff's hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )
    def __str__(self):
        return f"Cleaner: {self.name}"


# WorkManager Model
class WorkManager(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='manager')
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="work_managers")
    staff_members = models.ManyToManyField(StaffMember, through='WorkAssignment')
    departments = models.ManyToManyField(Department, related_name="work_managers")

    def save(self, *args, **kwargs):
        # Save the instance first so that it gets an ID and can be used in M2M relationships
        super().save(*args, **kwargs)

        departments = kwargs.get('departments', None)

        if departments is not None:
            # Validate that the hospital of each department matches the hospital of the WorkManager
            for department in departments:
                if department.hospital != self.hospital:
                    raise ValidationError(
                        f"WorkManager's hospital ({self.hospital}) and department's hospital ({department.hospital}) must match."
                    )

            # Set the departments (associate them with the WorkManager)
            self.departments.set(departments)

    def __str__(self):
        return f"{self.name}"



# WorkAssignment Model
class WorkAssignment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='work')
    staff_member = models.ForeignKey(StaffMember, on_delete=models.CASCADE)
    work_manager = models.ForeignKey(WorkManager, on_delete=models.CASCADE)
    work_name = models.CharField(max_length=100)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="work_assignments")
    assigned_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def clean(self):
        # Ensure that WorkAssignment's staff member and WorkManager belong to the same hospital
        if self.staff_member.hospital != self.work_manager.hospital:
            raise ValidationError("Staff member and WorkManager must belong to the same hospital.")

        # Ensure that the assigned hospital for work matches the hospital of the WorkManager
        if self.hospital != self.work_manager.hospital:
            raise ValidationError("The assigned hospital for work must match the WorkManager's hospital.")

    def __str__(self):
        return f"{self.work_manager}: {self.work_name} for {self.staff_member} start: {self.assigned_date}, end: {self.end_date}"










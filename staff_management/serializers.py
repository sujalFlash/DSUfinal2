# staff/serializers.py
from rest_framework import serializers
from .models import  Department,Doctor, StaffMember, NursingStaff, ReceptionStaff, CleaningStaff, WorkManager, WorkAssignment,CustomUser
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'hospital']
        read_only_fields = ['hospital']  # Make hospital read-only to prevent modification from client side

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and hasattr(request.user, 'manager'):
            work_manager = request.user.manager
            hospital = work_manager.hospital
        else:
            # Default or handle if there's no valid work manager, though it should always be present
            raise serializers.ValidationError("WorkManager instance not found or user is not authenticated.")

        # Create the department with the hospital field set
        return Department.objects.create(hospital=hospital, **validated_data)

class DoctorSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id','employee_id', 'name', 'specialization', 'departments', 'hospital', 'status', 'shift','is_in_hospital','on_duty']
class StaffMemberSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = StaffMember
        fields = ['user_id','id','employee_id', 'name', 'role', 'departments', 'hospital', 'status', 'shift','is_in_hospital','on_duty']

class NursingStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = NursingStaff
        fields = StaffMemberSerializer.Meta.fields + ['qualifications']

class ReceptionStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = ReceptionStaff
        fields = StaffMemberSerializer.Meta.fields + ['desk_assigned']

class CleaningStaffSerializer(StaffMemberSerializer):
    class Meta:
        model = CleaningStaff
        fields = StaffMemberSerializer.Meta.fields + ['area_assigned']

class WorkManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkManager
        fields = ['id', 'name', 'contact_number','staff_members','departments']

class WorkAssignmentSerializer(serializers.ModelSerializer):
    staff_member = StaffMemberSerializer()
    work_manager = WorkManagerSerializer()

    class Meta:
        model = WorkAssignment
        fields = ['id', 'staff_member', 'work_manager', 'work_name', 'assigned_date', 'end_date']



class ListDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'hospital']
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id','username','password']
        extra_kwargs={'password':{'write_only':True}}
    def create(self,validated_data):
        request=self.context.get('request')
        hospital=request.user.hospital
        password=validated_data.pop('password')
        user=CustomUser.objects.create(hospital=hospital,**validated_data)
        user.set_password(password)
        user.save()
        return user


class NurseCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(),
                                              required=True)  # Assuming the user is passed in the request

    class Meta:
        model = NursingStaff
        fields = ['user', 'employee_id', 'name', 'role', 'shift', 'departments', 'status', 'is_in_hospital', 'on_duty',
                  'qualifications']

    def create(self, validated_data):
        departments = validated_data.pop('departments', [])
        user = validated_data.pop('user')  # Pop user data from validated_data

        # Set the hospital to the hospital of the current user
        hospital = self.context['hospital']

        # Create NursingStaff instance
        nursing_staff = NursingStaff.objects.create(hospital=hospital, user=user, **validated_data)

        # Assign departments
        nursing_staff.departments.set(departments)

        return nursing_staff
class DoctorCreateSerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Doctor
        fields = ['user_id', 'employee_id', 'name', 'specialization', 'departments']

    def validate_employee_id(self, value):
        # Ensure the employee ID is unique
        if Doctor.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A doctor with this employee ID already exists.")
        return value

    def validate_user_id(self, value):
        try:
            # Ensure the user exists and belongs to the same hospital
            user = CustomUser.objects.get(id=value)
            auth_user = self.context['request'].user
            if user.hospital != auth_user.hospital:
                raise serializers.ValidationError("The user must belong to the same hospital as the authenticated user.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("The specified user does not exist.")
        return value

    def validate_departments(self, value):
        auth_user = self.context['request'].user
        hospital = auth_user.hospital

        # Ensure that each department belongs to the authenticated user's hospital
        for department in value:
            if department.hospital != hospital:
                raise serializers.ValidationError(f"Department {department.id} does not belong to your hospital.")
        return value

    def create(self, validated_data):
        departments = validated_data.pop('departments')
        hospital = self.context['request'].user.hospital
        doctor = Doctor.objects.create(hospital=hospital, **validated_data)
        doctor.departments.set(departments)
        return doctor

class CleanerCreateSerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = CleaningStaff
        fields = ['user_id', 'employee_id', 'name', 'area_assigned', 'departments']

    def validate_employee_id(self, value):
        if CleaningStaff.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A cleaner with this employee ID already exists.")
        return value

    def validate_user_id(self, value):
        try:
            user = CustomUser.objects.get(id=value)
            auth_user = self.context['request'].user
            if user.hospital != auth_user.hospital:
                raise serializers.ValidationError(
                    "The user must belong to the same hospital as the authenticated user.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("The specified user does not exist.")
        return value

    def validate_departments(self, value):
        auth_user = self.context['request'].user
        hospital = auth_user.hospital
        for department in value:
            if department.hospital != hospital:
                raise serializers.ValidationError(f"Department {department.id} does not belong to your hospital.")
        return value

    def create(self, validated_data):
        departments = validated_data.pop('departments')
        hospital = self.context['request'].user.hospital
        cleaner = CleaningStaff.objects.create(hospital=hospital, **validated_data)
        cleaner.departments.set(departments)
        return cleaner
class ReceptionStaffCreationSerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ReceptionStaff
        fields = ['user_id', 'employee_id', 'name', 'desk_assigned', 'departments']

    def validate_employee_id(self, value):
        if ReceptionStaff.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A reception with this employee ID already exists.")
        return value

    def validate_user_id(self, value):
        try:
            user = CustomUser.objects.get(id=value)
            auth_user = self.context['request'].user
            if user.hospital != auth_user.hospital:
                raise serializers.ValidationError(
                    "The user must belong to the same hospital as the authenticated user.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("The specified user does not exist.")
        return value

    def validate_departments(self, value):
        auth_user = self.context['request'].user
        hospital = auth_user.hospital
        for department in value:
            if department.hospital != hospital:
                raise serializers.ValidationError(f"Department {department.id} does not belong to your hospital.")
        return value

    def create(self, validated_data):
        departments = validated_data.pop('departments')
        hospital = self.context['request'].user.hospital
        reception = ReceptionStaff.objects.create(hospital=hospital, **validated_data)
        reception.departments.set(departments)
        return reception
class DoctorStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['shift', 'status', 'is_in_hospital', 'on_duty']

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError("Request body cannot be empty.")

        return attrs
class NurseStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=NursingStaff
        fields=['shift','status','is_in_hospital','on_duty']
    def validate(self,attrs):
        if not attrs:
            raise serializers.ValidationError("Request body cannot be empty.")
        return attrs

class CleaningStaffUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=CleaningStaff
        fields=['shift','status','is_in_hospital','on_duty','area_assigned']
    def validate(self,attrs):
        if not attrs:
            raise serializers.ValidationError("Request body cannot be empty.")
        return attrs
class ReceptionStaffUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=ReceptionStaff
        fields=['shift','status','is_in_hospital','on_duty','desk_assigned']
    def validate(self,attrs):
        if not attrs:
            raise serializers.ValidationError("Request body cannot be empty.")
        return attrs



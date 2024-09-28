# staff/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from .models import StaffMember, CustomUser

def generate_secure_password():
    return get_random_string(length=12)

@receiver(post_save, sender=StaffMember)
def create_user_for_staff(sender, instance, created, **kwargs):
    if created:
        password = generate_secure_password()
        user = CustomUser.objects.create_user(
            username=instance.name,
            password=password,
            hospital=instance.hospital
        )

        # Send the password to the staff member via email
        send_mail(
            'Your Account Credentials',
            f'Hello {instance.name},\n\nYour account has been created. Your password is: {password}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],  # Assuming `CustomUser` has an email field
            fail_silently=False,
        )

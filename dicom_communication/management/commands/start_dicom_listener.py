from django.core.management.base import BaseCommand
from dicom_communication.dicom_listener import start_dicom_listener
# to initiate dicom listener as background process
class Command(BaseCommand):
    help = 'Start the DICOM listener'
    def handle(self, *args, **options):
        self.stdout.write('Starting DICOM listener...')
        start_dicom_listener()
#to initiate dicom_listener command python manage.py start_dicom_listener

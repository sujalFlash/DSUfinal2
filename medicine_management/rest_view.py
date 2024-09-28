import logging
import traceback
from smtplib import SMTPRecipientsRefused, SMTPAuthenticationError, SMTPConnectError, SMTPDataError

from django.core.mail import send_mail
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListCreateAPIView, ListAPIView
from .models import Medicines
from .serializers import MedicineSerializer
from hospital_management.models import Hospital

from .serializers import MedicineCreateSerializer
class Medicine_View(APIView):
    permission_classes = [IsAuthenticated]
    model = Medicines
    serializer_class = MedicineSerializer
    http_allowed_methods = ['get']
    def get(self, request):
        medicines=Medicines.objects.filter(hospital=request.user.hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
class Medicine_Create(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MedicineCreateSerializer
    def perform_create(self,serializer):
        serializer.save(hospital=self.request.user.hospital)

class Medicine_List_View_from_other_hospitals(APIView):
    model=Medicines
    permission_classes = [IsAuthenticated]
    serializer_class = MedicineSerializer
    http_allowed_methods = ['get']
    def get(self,request):
        medicines=Medicines.objects.exclude(hospital = request.user.hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


from django.conf import settings

logger = logging.getLogger(__name__)
class Medicine_request_view(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get data from the request
        brand_name = request.data.get('brand_name')
        chemical_name = request.data.get('chemical_name')
        quantity_needed = request.data.get('quantity_needed')
        target_hospital = request.data.get('target_hospital')
        # Validate the inputs (optional but recommended)
        if not all([brand_name, chemical_name, quantity_needed, target_hospital]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_hospital_obj = Hospital.objects.get(id=target_hospital)
            target_email = target_hospital_obj.email
            print(target_email)
        except Hospital.DoesNotExist:
            return Response({"error": "Target hospital not found"}, status=status.HTTP_404_NOT_FOUND)

        # Compose the email subject and message
        subject = f"Medicine Request from {request.user.hospital.name}"
        message = f"""
        A medicine request has been made from {request.user.hospital.name}:

        Medicine Brand Name: {brand_name}
        Chemical Name: {chemical_name}
        Quantity Needed: {quantity_needed}

        Please respond to this request if you can fulfill it.

        Regards,
        {request.user.hospital.name}
        """

        try:
            # Print debug information before sending the email
            print(f"Attempting to send email from {settings.DEFAULT_FROM_EMAIL} to {target_email}")
            print(f"Email subject: {subject}")
            print(f"Email message: {message}")

            # Send the email
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [target_email],
                fail_silently=False
            )

            # Debug print after successful email sending
            print("Email sent successfully!")
            return Response({"message": "Medicine request email sent successfully"}, status=status.HTTP_200_OK)

        except SMTPRecipientsRefused as e:
            logger.error(f"Recipient address refused: {e.recipients}")
            return Response({"error": f"Recipient address refused: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except SMTPAuthenticationError as e:
            logger.error(f"Authentication error: {str(e)}")
            return Response({"error": f"Authentication error: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)

        except SMTPConnectError as e:
            logger.error(f"Connection error: {str(e)}")
            return Response({"error": f"Connection error: {str(e)}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except SMTPDataError as e:
            logger.error(f"Data error: {str(e)}")
            return Response({"error": f"Data error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Log the unexpected error with traceback
            logger.error(f"An unexpected error occurred: {str(e)}")
            logger.error(traceback.format_exc())  # Print the stack trace to the logs

            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

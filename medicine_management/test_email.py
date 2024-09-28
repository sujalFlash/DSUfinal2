import smtplib

# Define SMTP server details
smtp_server = "smtp.gmail.com"
port = 587  # For starttls

# Your email credentials
sender_email = "1si22ci052@sit.ac.in"
password = "nutdkxlbuucatcdw"

try:
    # Try to establish a connection to the SMTP server
    server = smtplib.SMTP(smtp_server, port)

    # Identify the client to the SMTP server
    server.ehlo()

    # Start TLS for security
    server.starttls()
    server.ehlo()  # Re-identify after starting TLS

    # Try logging into the email server
    server.login(sender_email, password)

    print("Successfully connected and authenticated!")

except Exception as e:
    print(f"Error: {e}")

finally:
    server.quit()
import socket

try:
    ip = socket.gethostbyname('smtp.gmail.com')
    print(f"Gmail SMTP IP Address: {ip}")
except socket.gaierror as e:
    print(f"Error resolving domain: {e}")
from django.core.mail import send_mail
from django.conf import settings
import os,django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DSU.settings')  # Change 'DSU' to your project's name

# Setup Django
django.setup()
try:
    send_mail(
        'Test Subject',
        'Test message',
        settings.DEFAULT_FROM_EMAIL,
        ['sujal.1si22ci052@gmail.com'],
        fail_silently=False,

    )
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")

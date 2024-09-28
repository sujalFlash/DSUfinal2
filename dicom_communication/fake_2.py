import pydicom
from pydicom.uid import generate_uid

# Load the DICOM file
filepath = r"C:\Users\sujal\PycharmProjects\DSU\dicom_communication\generated_sample.dcm"
ds = pydicom.dcmread(filepath,force=True)

# Add missing SOP Class UID and SOP Instance UID to the dataset
ds.SOPClassUID = pydicom.uid.CTImageStorage  # Add SOP Class UID
ds.SOPInstanceUID = generate_uid()  # Generate and add a unique SOP Instance UID

# Save the updated DICOM file
ds.save_as(filepath)

print(f"Updated DICOM file saved at {filepath}")

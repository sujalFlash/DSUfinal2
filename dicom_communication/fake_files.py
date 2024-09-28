import numpy as np
import pydicom
from pydicom.dataset import Dataset, FileDataset
import datetime
import os
from pydicom.uid import ImplicitVRLittleEndian, generate_uid
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter


def create_dicom(output_path, patient_name="Vishal Kumar", patient_id="954321", rows=128, cols=128):
    # Create the DICOM dataset object
    file_meta = pydicom.dataset.FileMetaDataset()
    file_meta.MediaStorageSOPClassUID = pydicom.uid.CTImageStorage  # Standard SOP Class UID for CT images
    file_meta.MediaStorageSOPInstanceUID = generate_uid()
    file_meta.ImplementationClassUID = generate_uid()
    file_meta.TransferSyntaxUID = ImplicitVRLittleEndian

    # Create the dataset
    ds = FileDataset(output_path, {}, file_meta=file_meta, preamble=b"\0" * 128)

    # Add patient information
    ds.PatientName = patient_name
    ds.PatientID = patient_id
    ds.StudyInstanceUID = generate_uid()
    ds.SeriesInstanceUID = generate_uid()
    ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
    ds.SOPClassUID = file_meta.MediaStorageSOPClassUID
    ds.file_meta = file_meta  # Assign the file meta to the dataset

    # Image data
    ds.Modality = 'CT'
    ds.ContentDate = str(datetime.date.today()).replace("-", "")
    ds.ContentTime = str(datetime.datetime.now().time()).replace(":", "").split(".")[0]

    # Set dimensions of the image
    ds.Rows = rows
    ds.Columns = cols

    # Create a more realistic X-ray-like pixel array
    x = np.linspace(-1, 1, cols)
    y = np.linspace(-1, 1, rows)
    X, Y = np.meshgrid(x, y)

    # Create a circular region to simulate bone (higher intensity)
    radius = 0.4
    bone_region = np.sqrt(X ** 2 + Y ** 2) < radius  # Creates a smooth transition between regions

    # Create a background tissue region with lower intensity
    tissue_region = np.ones((rows, cols)) * 0.15  # Simulate tissue with a lower base intensity

    # Simulate bone structure with internal variations
    bone_texture = np.random.normal(0.8, 0.05, size=(rows, cols))  # Random variations inside the bone

    # Apply a gradient around the bone edges for smoothness
    smooth_edges = np.clip(np.sqrt(X ** 2 + Y ** 2) / radius, 0, 1)  # Gradient at the edge of the bone

    # Combine bone and tissue regions with smooth transitions around edges
    pixel_array = np.where(bone_region, bone_texture, tissue_region) * (1 - smooth_edges)

    # Add fine grain noise to simulate tissue and bone randomness
    noise = np.random.normal(0, 0.08, pixel_array.shape)
    pixel_array = np.clip(pixel_array + noise, 0, 1) * 255

    # Slightly smooth the image to resemble X-ray visuals
    pixel_array = gaussian_filter(pixel_array, sigma=1)

    # Set pixel data
    ds.PixelData = pixel_array.astype(np.uint8).tobytes()

    # Set additional metadata
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.SamplesPerPixel = 1
    ds.BitsAllocated = 8
    ds.BitsStored = 8
    ds.HighBit = 7
    ds.PixelRepresentation = 0

    # Save the DICOM file
    ds.save_as(output_path)
    print(f"DICOM file saved as: {output_path}")


# Usage
output_dir = './'
output_file = os.path.join(output_dir, "test6.dcm")
create_dicom(output_file)

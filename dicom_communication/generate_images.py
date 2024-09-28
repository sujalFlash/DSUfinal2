import matplotlib.pyplot as plt
import pydicom
import numpy as np

# Full path of the DICOM file
base = r"C:\Users\sujal\PycharmProjects\DSU\dicom_communication"
pass_dicom = "0.dcm"

# Reading the DICOM file
filename = base + "\\" + pass_dicom
ds = pydicom.dcmread(filename)

# Rescaling pixel values if necessary
if 'RescaleSlope' in ds and 'RescaleIntercept' in ds:
    intercept = ds.RescaleIntercept
    slope = ds.RescaleSlope
    image = ds.pixel_array * slope + intercept
else:
    image = ds.pixel_array

# Adjusting for window center and width if available
if 'WindowCenter' in ds and 'WindowWidth' in ds:
    window_center = float(ds.WindowCenter)
    window_width = float(ds.WindowWidth)

    # Apply windowing
    adjusted_image = np.clip((image - (window_center - 0.5)) / (window_width - 1) + 0.5, 0, 1)
else:
    # If no windowing parameters, just normalize the image
    adjusted_image = image / np.max(image)
print(ds.pixel_array)

# Plot the DICOM image
plt.imshow(adjusted_image, cmap=plt.cm.bone)
plt.title("Adjusted DICOM Image")
plt.colorbar()  # Adding a color bar for intensity reference
plt.show()

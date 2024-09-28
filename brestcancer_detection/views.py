from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import logging
import tensorflow as tf
# Initialize logging
logger = logging.getLogger(__name__)

# Load your pre-trained Keras model
MODEL_PATH = r"C:\Users\sujal\OneDrive\Desktop\best_model3.h5"
model=load_model(MODEL_PATH,compile=False)

class PredictCancerView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Handle file uploads

    def post(self, request, *args, **kwargs):
        # Safely get the uploaded image
        image_file = request.FILES.get('image')

        if image_file is None:
            return Response({'error': 'No image file provided'}, status=400)

        # Validate and open the image
        try:
            image = Image.open(image_file)
            # Check if the image is in a valid format
            if image.format not in ['JPEG', 'PNG', 'GIF']:
                return Response({'error': 'Invalid image format. Please upload a JPEG or PNG.'}, status=400)

            # Preprocess the image
            image = image.resize((128, 128))  # Resize to the model's expected input size
            image_array = np.asarray(image)

            # Check if the image array has the correct shape and type
            if image_array.ndim != 3 or image_array.shape[-1] not in [3, 4]:
                return Response({'error': 'Image must have 3 (RGB) or 4 (RGBA) channels.'}, status=400)

            image_array = image_array / 255.0  # Normalize pixel values
            image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        except Exception as e:
            logger.error(f"Error processing the image: {e}")
            return Response({'error': f'Failed to process image: {str(e)}'}, status=400)

        # Make the prediction
        try:
            logger.info("Making prediction.")
            prediction = model.predict(image_array)
            logger.info(f"Raw prediction output: {prediction}, shape: {prediction.shape}")

            # Handle predictions
            if prediction.shape[1] == 1:  # Binary classification
                malignant_confidence = float(prediction[0][0])
                benign_confidence = 1 - malignant_confidence  # Calculate benign confidence
                return Response({
                    'probabilistic_values': {
                        'benign': benign_confidence,
                        'malignant': malignant_confidence
                    }
                })
            else:  # Multi-class classification
                benign_confidence = float(prediction[0][0])
                malignant_confidence = float(prediction[0][1])
                normal_confidence = float(prediction[0][2])

                return Response({
                    'probabilistic_values': {
                        'benign': benign_confidence,
                        'malignant': malignant_confidence,
                        'normal': normal_confidence
                    }
                })

        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return Response({'error': 'Prediction failed'}, status=500)

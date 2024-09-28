from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from .models import ImageFeedback  # Assuming you have an ImageFeedback model
import numpy as np
import cv2
from keras.models import load_model
import os

# Load your pre-trained model
model = load_model(r"C:\Users\sujal\OneDrive\Desktop\best_model3.h5",compile=False)  # Adjust the path accordingly
@csrf_exempt
def predict_cancer(request):
    if request.method == 'POST' and request.FILES['image']:
        # Get the uploaded file
        uploaded_file = request.FILES['image']
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.url(filename)

        # Preprocess the image
        image = cv2.imread(file_path)
        image = cv2.resize(image, (224, 224))  # Adjust according to your model's input size
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        image = image / 255.0  # Normalize the image if required

        # Make prediction
        predictions = model.predict(image)
        predicted_class = np.argmax(predictions, axis=1)[0]  # Get the class index
        class_labels = ['normal', 'benign', 'malignant']  # Adjust based on your model's labels
        predicted_label = class_labels[predicted_class]

        return render(request, 'feedback.html', {'predicted_label': predicted_label, 'file_path': file_path})

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def feedback(request):
    if request.method == 'POST':
        image_path = request.POST.get('image_path')
        user_feedback = request.POST.get('feedback')  # 'correct' or 'incorrect'
        correct_label = request.POST.get('correct_label', None)  # Only if feedback is 'incorrect'

        # Save the feedback in the database
        feedback_entry = ImageFeedback(image_path=image_path, user_feedback=user_feedback, correct_label=correct_label)
        feedback_entry.save()

        if user_feedback == 'incorrect' and correct_label:
            # Update the model with the new correct label
            # Here you would implement the logic to retrain your model using the provided correct label.
            # For simplicity, we're just logging it; actual implementation would require a model retraining setup.
            print(f"Retraining model with image {image_path} as {correct_label}")

        return JsonResponse({'message': 'Feedback received successfully.'})
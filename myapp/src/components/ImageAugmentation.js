import React, { useState } from 'react';

const ImageAugmentation = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [augmentedImage, setAugmentedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.dcm')) {
      setSelectedImage(file);
      setAugmentedImage(null);
      setError(null);
      setIsSubmitting(false);
    } else {
      setError('Please upload a valid .dcm image.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('No image selected.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/image_augmentation/augment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setAugmentedImage(imageUrl);
        setError(null);
      } else {
        setError('Failed to augment the image.');
      }
    } catch (err) {
      console.error('Error during image augmentation:', err);
      setError('An error occurred while augmenting the image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '20px',
        overflowY: 'auto', // Enable scrolling
        maxHeight: '80vh', // Set a max height for scrolling
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '50px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Hiding scrollbar for WebKit (Chrome, Safari) */}
      <style>
        {`
          /* Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#1b1b27' }}>Image Augmentation</h2>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept=".dcm" 
          onChange={handleImageUpload} 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #1b1b27', width: '100%' }}
        />
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {selectedImage && <p style={{ marginTop: '10px', fontSize: '16px', color: '#1b1b27' }}>Selected Image: {selectedImage.name}</p>}
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            backgroundColor: isSubmitting ? '#1b1b27' : '#1b1b27',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            width: '100%',
          }}
        >
          {isSubmitting ? 'Processing...' : 'Submit for Augmentation'}
        </button>
      </div>

      <div style={{ marginTop: '40px' }}>
        {selectedImage && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#1b1b27' }}>Uploaded Image:</h3>
            <p style={{ fontSize: '16px', color: '#1b1b27' }}>{selectedImage.name}</p>
          </div>
        )}

        {augmentedImage && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#1b1b27' }}>Augmented Image:</h3>
            <img 
              src={augmentedImage} 
              alt="Augmented" 
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAugmentation;

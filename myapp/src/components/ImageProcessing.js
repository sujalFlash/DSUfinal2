import React, { useState } from 'react';

const ImageProcessing = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [normalization, setNormalization] = useState(0);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.dcm')) {
      setSelectedImage(file);
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

    if (normalization < 0 || normalization > 1) {
      setError('Normalization value must be between 0 and 1.');
      return;
    }

    if (!resizeWidth || !resizeHeight) {
      setError('Please provide both resize width and height.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('normalization', normalization);
    formData.append('resize_width', resizeWidth);
    formData.append('resize_height', resizeHeight);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/image_processing/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProcessedImage(imageUrl);
        setError(null);
      } else {
        setError('Failed to process the image.');
      }
    } catch (err) {
      console.error('Error during image processing:', err);
      setError('An error occurred while processing the image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
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
      <style>
        {`
          ::-webkit-scrollbar {
            display: none; /* Hides scrollbar in WebKit browsers */
          }
        `}
      </style>

      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#1b1b27' }}>Image Processing</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept=".dcm"
          onChange={handleImageUpload}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #1b1b27', width: '100%' }}
        />
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {selectedImage && <p style={{ marginTop: '10px', fontSize: '16px', color: '#1b1b27' }}>Selected Image: {selectedImage.name}</p>}

        <label style={{ display: 'block', marginTop: '20px', color: '#1b1b27', fontSize: '16px' }}>Normalization (0-1):</label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={normalization}
          onChange={(e) => setNormalization(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #1b1b27' }}
        />

        <label style={{ display: 'block', marginTop: '20px', color: '#1b1b27', fontSize: '16px' }}>Resize Width:</label>
        <input
          type="number"
          value={resizeWidth}
          onChange={(e) => setResizeWidth(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #1b1b27' }}
        />

        <label style={{ display: 'block', marginTop: '20px', color: '#1b1b27', fontSize: '16px' }}>Resize Height:</label>
        <input
          type="number"
          value={resizeHeight}
          onChange={(e) => setResizeHeight(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #1b1b27' }}
        />

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
          {isSubmitting ? 'Processing...' : 'Submit for Processing'}
        </button>
      </div>

      {processedImage && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#1b1b27'}}>Processed Image:</h3>
          <img
            src={processedImage}
            alt="Processed"
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
  );
};

export default ImageProcessing;

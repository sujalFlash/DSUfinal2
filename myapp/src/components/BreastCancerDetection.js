import React, { useState } from 'react';

const BreastCancerDetection = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid .png image.');
            setSelectedFile(null);
            setImagePreview('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please upload a valid .png image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/predict/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setPrediction(result.probabilistic_values);
            } else {
                setPrediction({ error: 'Failed to get prediction.' });
            }
        } catch (error) {
            setPrediction({ error: 'Something went wrong.' });
        }
    };

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            color: '#1b1b27',
            height: '100vh',
            overflowY: 'scroll',  // Enable scrolling
            msOverflowStyle: 'none',  // Hide scrollbar in IE and Edge
            scrollbarWidth: 'none'  // Hide scrollbar in Firefox
        }}>
            <style>
                {`
                    /* Hide scrollbar in Chrome, Safari and Opera */
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Breast Cancer Detection</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="file"
                    accept=".png"
                    onChange={handleFileChange}
                    style={{
                        padding: '10px',
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1b1b27',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                >
                    Submit
                </button>
            </form>
            {imagePreview && (
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Image Preview:</h3>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
            )}
            {prediction && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Prediction:</h3>
                    {prediction.error ? (
                        <p style={{ color: 'red', fontSize: '18px' }}>{prediction.error}</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: '0', fontSize: '18px' }}>
                            <li style={{ marginBottom: '5px' }}>Benign: <strong>{prediction.benign.toFixed(2)}</strong></li>
                            <li style={{ marginBottom: '5px' }}>Malignant: <strong>{prediction.malignant.toFixed(2)}</strong></li>
                            <li style={{ marginBottom: '5px' }}>Normal: <strong>{prediction.normal.toFixed(2)}</strong></li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default BreastCancerDetection;

import React from 'react';
import { Link } from 'react-router-dom';

const ImageManagement = () => {
  return (
    <div className="image-management-container">
      <h2>Image Management</h2>
      <div className="action-buttons">
        <Link to="/image-management/augmentation" className="btn">Image Augmentation</Link>
        <Link to="/image-management/processing" className="btn">Image Processing</Link>
      </div>
    </div>
  );
};

export default ImageManagement;

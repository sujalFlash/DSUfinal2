// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import CreateDepartment from './components/CreateDepartment';
import ListDepartment from './components/ListDepartment';
import HospitalsPage from './components/HospitalsPage';
import DiseaseHistory from './components/DiseaseHistory';
import ViewDoctor from  './components/ViewDoctor';
import ViewNurse from  './components/ViewNurse';
import ViewCleaners from  './components/ViewCleaners';
import DeleteDoctor from './components/DeleteDoctor';
import DeleteNurse from './components/DeleteNurse';
import DeleteCleaners from './components/DeleteCleaners';
import ViewReceptionists from './components/ViewReceptionist';
import DeleteReceptionist from './components/DeleteReceptionist';
import CreateUser from './components/CreateUser';
import CreateDoctor from './components/CreateDoctor';
import CreateNurse from './components/CreateNurse';
import CreateReceptionist from './components/CreateReceptionist';
import ViewReceptionist from './components/ViewReceptionist';
import CreateCleaner from './components/CreateCleaner';
import ViewDepartment from './components/ViewDepartment';
import AddDisease from './components/AddDisease';
import ImageManagement from './components/ImageManagement';
import ImageAugmentation from './components/ImageAugmentation';
import ImageProcessing from './components/ImageProcessing';
import ViewMedicines from './components/ViewMedicines';
import SourceMedicine from './components/SourceMedicine';
import BreastCancerDetection from './components/BreastCancerDetection';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-department" element={<CreateDepartment />} />
        <Route path="/list-department" element={<ListDepartment />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/create-doctor" element={<CreateDoctor />} /> 
        <Route path="/create-nurse" element={<CreateNurse />} /> 
        <Route path="/disease-history" element={<DiseaseHistory />} />
        <Route path="/view-doctor" element={<ViewDoctor />} />
        <Route path="/view-nurse" element={<ViewNurse />} />
        <Route path="/view-cleaners" element={<ViewCleaners />} />
        <Route path="/delete-doctor" element={<DeleteDoctor />} />
        <Route path="/delete-nurse" element={<DeleteNurse />} />
        <Route path="/delete-cleaners" element={<DeleteCleaners />} />
        <Route path="/view-receptionists" element={<ViewReceptionists />} />
        <Route path="/delete-receptionist" element={<DeleteReceptionist />} />
        <Route path="/create-receptionist" element={<CreateReceptionist />} />
        <Route path="/create-cleaner" element={<CreateCleaner/>} />
        <Route path="/view-receptionist" element={<ViewReceptionist />} />
        <Route path="/view-department" element={<ViewDepartment />} />
        <Route path="/add-disease" element={<AddDisease />} />
        <Route path="/image-management" element={<ImageManagement />} />
        <Route path="/image-management/augmentation" element={<ImageAugmentation />} />
        <Route path="/image-management/processing" element={<ImageProcessing />} />
        <Route path="/view-medicines" element={<ViewMedicines />} />
        <Route path="/source-medicine" element={<SourceMedicine />} />
        <Route path="/breast-cancer-detection" element={<BreastCancerDetection />} />
      </Routes>
    </Router>
  );
}

export default App;

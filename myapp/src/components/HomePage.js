import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate hook
import './HomePage.css';
import Image1 from '../images/img1.png';
import Image2 from '../images/img2.png'; 
import Image3 from '../images/img3.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faLink, faShareAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import pacsImage from '../images/img4.png';
import { faSyncAlt, faCheckCircle, faDollarSign } from '@fortawesome/free-solid-svg-icons';


const HomePage = () => {
  const [isDescriptionVisible, setDescriptionVisibility] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleDescription = () => {
    setDescriptionVisibility(!isDescriptionVisible);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  // Navigation functions
  const goToLoginPage = () => {
    navigate('/login');
  };

  const goToSignupPage = () => {
    navigate('/signup');
  };

  return (
    <div className='outer'>
      <nav className="navbar">
        <div className="navbar-logo">MedAI</div>
        <ul className="navbar-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#imaging">Imaging</a></li>
          <li><Link to="/hospitals">Hospitals</Link></li> 
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      
      <div className="container fst">
        <div className="text-section">
          <h1 className="title">AI-Powered Healthcare Solutions</h1>
          <p className="subtitle">
            Revolutionizing healthcare with intelligent technology for better patient care and outcomes.
          </p>
          <button className="lbutton" onClick={goToLoginPage}>Login</button>
          <button className="lbutton" onClick={goToSignupPage}>Signup</button>
        </div>
        <div className="image-section">
          <img src={Image1} alt="Healthcare Solutions" className="hospital-image" />
        </div>
      </div>
     
  
      {/* Rest of the HomePage content */}
      <div className="container">
        <div className="image-section">
          <img src={Image2} alt="Medical Imaging" className="medical-image" />
        </div>
        <div className="content-section">
          <h1 className="medical-title">Medical Imaging and Cancer Diagnosis</h1>
          <div className="content-list">
            <div className="list-item">
              <div className="number">1</div>
              <div className="content">
                <h2 className="item-title">Automated Detection</h2>
                <p className="item-description">
                  Our AI algorithms analyze medical images to identify potential abnormalities with high accuracy.
                </p>
              </div>
            </div>
            <div className="list-item">
              <div className="number">2</div>
              <div className="content">
                <h2 className="item-title">Personalized Treatment Plans</h2>
                <p className="item-description">
                  Accurate diagnoses enable doctors to tailor treatment plans based on individual patient needs.
                </p>
              </div>
            </div>
            <div className="list-item">
              <div className="number">3</div>
              <div className="content">
                <h2 className="item-title">Early Intervention</h2>
                <p className="item-description">
                  Early detection allows for timely interventions, increasing the chances of successful treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional sections */}
      <div className="workflow-container">
        <h2 className="workflow-title">Streamlined Workflow for Hospitals</h2>
        <div className="workflow-cards">
          <div className="workflow-card">
            <h3>Efficient Data Management</h3>
            <p>
              Our platform centralizes and digitizes patient records, streamlining administrative processes.
            </p>
          </div>
          <div className="workflow-card">
            <h3>Improved Communication</h3>
            <p>
              Secure communication channels allow healthcare professionals to collaborate effectively.
            </p>
          </div>
          <div className="workflow-card">
            <h3>Reduced Wait Times</h3>
            <p>
              Automated tasks and optimized workflows contribute to faster patient care.
            </p>
          </div>
        </div>
      </div>
      <div className="focus-container">
        <h2 className="focus-title">Focusing on Government Hospitals</h2>
        <div className="focus-cards">
          <div className="focus-card">
            <h3>Enhanced Access</h3>
            <p>
              Our platform empowers government hospitals to provide advanced healthcare to underserved communities.
            </p>
          </div>
          <div className="focus-card">
            <h3>Improved Efficiency</h3>
            <p>
              Streamlined workflows and automated tasks optimize resource utilization in public healthcare facilities.
            </p>
          </div>
          <div className="focus-card">
            <h3>Data-Driven Insights</h3>
            <p>
              Analytics and reporting tools provide valuable insights to improve healthcare delivery and resource allocation.
            </p>
          </div>
        </div>
      </div>
      <div className="analysis-container">
        <h2 className="analysis-title">Medical Report Analysis</h2>
        <div className="analysis-steps">
          <div className="analysis-step">
            <div className="step-number">1</div>
            <h3>Automated Extraction</h3>
            <p>
              AI algorithms identify key findings and insights from complex medical reports.
            </p>
          </div>
          <div className="analysis-step">
            <div className="step-number">2</div>
            <h3>Data Visualization</h3>
            <p>
              Visual representations of findings facilitate better understanding and interpretation.
            </p>
          </div>
          <div className="analysis-step">
            <div className="step-number">3</div>
            <h3>Actionable Insights</h3>
            <p>
              Reports provide clear recommendations for treatment and further investigation.
            </p>
          </div>
        </div>
      </div>
     
 <div className="container xray">
      <div className="xray-card">
         <img src={Image3} alt="X-ray Skeleton" className="xray-image" style={{width:'300px',height:'350px'}}/>
      </div>
    
      <div className="xray-analysis">
        <h1>X-ray Report Analysis</h1>
        <ul>
          <li>Improved Diagnostic Accuracy</li>
          <li>Faster Reporting Times</li>
          <li>Reduced Errors</li>
        </ul>
      </div>
    </div>
    <div className="container">
      <h1 className='priority-h1'>Automated Prioritization for Urgent Cases</h1>
      <table className="priority-table">
        <thead>
          <tr>
            <th>Severity Level</th>
            <th>Automated Response</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>High</td>
            <td>Immediate notification and escalation to relevant medical staff.</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>Prioritized scheduling for timely evaluation and care.</td>
          </tr>
          <tr>
            <td>Low</td>
            <td>Routine scheduling based on patient needs and availability.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="container">
      <div className="left-content">
        <h1>Integration with PACS Systems</h1>
        <div className="feature">
          <FontAwesomeIcon icon={faCloud} size="2x" className="icon" />
          <div>
            <h3>Secure Cloud Storage</h3>
            <p>Centralized storage and access to medical images and reports.</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faLink} size="2x" className="icon" />
          <div>
            <h3>Interoperability</h3>
            <p>Seamless integration with existing hospital systems and databases.</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faShareAlt} size="2x" className="icon" />
          <div>
            <h3>Data Sharing</h3>
            <p>Secure and efficient sharing of medical information with authorized users.</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faUser} size="2x" className="icon" />
          <div>
            <h3>User-Friendly Interface</h3>
            <p>Intuitive platform for healthcare professionals to manage patient data.</p>
          </div>
        </div>
      </div>
      <div className="right-content">
        <img src={pacsImage} alt="PACS System" style={{width:'250px',height:'500px'}}/>
      </div>
    </div>
  

    <div className="container">

      <div className="rightPane">
        <h2 className="eqtitle">Equipment Tracking and Fulfillment</h2>
        <ul className="list">
          <li className="listItem">
            <FontAwesomeIcon icon={faCloud} className="icon" /> 
            <div>
              <h4>Real-Time Inventory Management</h4>
              <p>Track equipment availability and location in real-time, reducing delays.</p>
            </div>
          </li>
          <li className="listItem">
            <FontAwesomeIcon icon={faSyncAlt} className="icon" /> 
            <div>
              <h4>Automated Ordering</h4>
              <p>Trigger automatic reordering when inventory levels fall below predetermined thresholds.</p>
            </div>
          </li>
          <li className="listItem">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" />
            <div>
              <h4>Efficient Distribution</h4>
              <p>Optimize equipment delivery routes and schedules to minimize wait times.</p>
            </div>
          </li>
          <li className="listItem">
            <FontAwesomeIcon icon={faDollarSign} className="icon" />
            <div>
              <h4>Cost Optimization</h4>
              <p>Reduce unnecessary purchases and optimize resource allocation.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    
    <div className="card-container">
      <div className="card-content">
        <h2>Connecting Hospitals for Medicine Sharing</h2>
        <p className="network-info" onClick={toggleDescription}>
          <span className="arrowicon">{isDescriptionVisible ? '▲' : '▼'}</span>
          Medicine Sharing Network
        </p>
        {isDescriptionVisible && (
          <p className="description">
            Our platform facilitates secure and efficient medicine sharing between hospitals to ensure optimal utilization and reduce waste. Hospitals can donate or request medicines before expiry, improving access to essential medications for patients in need.
          </p>
        )}
      </div>
    </div>
    </div>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import PersonalInfoStep from '../components/multiStepForm/PersonalInfo';
import AddressStep from '../components/multiStepForm/Address';
import ContactInfoStep from '../components/multiStepForm/ContactInfo';
import DocumentStep from '../components/multiStepForm/Document';
import EmergencyContactStep from '../components/multiStepForm/EmergencyContact';
import { RootState } from '../store/store';
import { useAppSelector, useGlobal } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import Documents from '../components/multiStepForm/Documents';

const Profile: React.FC = () => {
  const navigate = useNavigate(); 
  const [activeSection, setActiveSection] = useState<string>('name');
  const oaInfo = useAppSelector((state: RootState) => state.oaInfo);
  const { showLoading, showMessage } = useGlobal();

  useEffect(() => {
    if (oaInfo.status !== "Approved") {
      showMessage('You are not approved to view this page', 'error', 2000);
      navigate('/onboardingapplication');
    }
  }, [oaInfo.status]);

  const renderSection = () => {
    switch (activeSection) {
      case 'name':
        return <PersonalInfoStep />;
      case 'address':
        return <AddressStep />;
      case 'contact':
        return <ContactInfoStep />;
      case 'employment':
        return <DocumentStep />;
      case 'emergency':
        return <EmergencyContactStep />;
      case 'documents':
        return <Documents />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="w-full flex justify-center items-start mt-16">
      <div className="fixed left-0 top-0 h-full w-1/5 bg-gray-200 p-4">
        <ul className="space-y-4 mt-20 text-xl">
          <li
            className={`cursor-pointer ${activeSection === 'name' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('name')}
          >
            Name
          </li>
          <li
            className={`cursor-pointer ${activeSection === 'address' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('address')}
          >
            Address
          </li>
          <li
            className={`cursor-pointer ${activeSection === 'contact' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('contact')}
          >
            Contact Info
          </li>
          <li
            className={`cursor-pointer ${activeSection === 'employment' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('employment')}
          >
            Employment
          </li>
          <li
            className={`cursor-pointer ${activeSection === 'emergency' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('emergency')}
          >
            Emergency Contact
          </li>
          <li
            className={`cursor-pointer ${activeSection === 'documents' ? 'font-bold' : ''}`}
            onClick={() => setActiveSection('documents')}
          >
            Documents
          </li>
        </ul>
      </div>
      <div className="ml-1/4 w-3/4 p-4">
        {renderSection()}
      </div>
    </div>
  );
};

export default Profile;
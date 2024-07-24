import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateOAName, updateOAIdentity, updateOACurrentAddress, updateOAContactInfo, updateOAEmployment, updateOAReference, updateOAEmergencyContact, getUrl, addOADocument, updateOAProfilePic, updateOAStatus } from '../../store/oaInfo';
import { OaNameType, IdentityType, EmploymentType, ReferenceType } from '../../utils/type';
import StepController from './StepController';
import { useNavigate } from 'react-router-dom';
import DocViewerComponent from '../DocViewer';
import { Typography } from "@mui/material";

function base64ToFile(base64: string, filename: string): { file: File, mimeType: string } {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { file: new File([u8arr], filename, { type: mime }), mimeType: mime };
}

const Summary: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.oaInfo.userId);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const oaInfo = useSelector((state: RootState) => state.oaInfo);
  const startDate = new Date('2000-01-01T00:00:00.000+00:00').toISOString();
  const endDate = new Date('2000-01-01T00:00:00.000+00:00').toISOString();
  const navigate = useNavigate(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem(`oaInfo-${userId}`);
    
    if (storedData) {
      const data = JSON.parse(storedData);
      setPersonalInfo(data.personalInfo);
      setDocumentInfo(data.document);
      setDocuments(data.documents);
    }
  }, []);

  const downloadFile = (base64Data: string, fileName: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data.split(',')[1]}`;
    link.download = fileName;
    link.click();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const onboardingApplicationId = user.instance?.onboardingApplication?.id;

    if (!onboardingApplicationId) {
      console.error('No Login info found in local');
      return;
    }

    const oaName: OaNameType = {
      firstName: oaInfo.personalInfo.firstName,
      middleName: oaInfo.personalInfo.middleName || '',
      lastName: oaInfo.personalInfo.lastName,
      preferredName: oaInfo.personalInfo.preferredName || ''
    };
    
    const oaIdentity: IdentityType = {
      ssn: oaInfo.personalInfo.ssn,
      dob: oaInfo.personalInfo.dob,
      gender: oaInfo.personalInfo.gender
    };

    let oaEmployment: EmploymentType;
    if (oaInfo.document.isCitizen) {
      oaEmployment = {
        visaTitle: 'isCitizen',
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      const tempTitle = oaInfo.document.visaTitle === 'Other' ? oaInfo.document.otherVisa : oaInfo.document.visaTitle;
      oaEmployment = {
        visaTitle: tempTitle,
        startDate: oaInfo.document.startDate,
        endDate: oaInfo.document.endDate,
      };  
    }

    let oaReference: ReferenceType;
    if(oaInfo.reference){
      oaReference = {
        firstName: oaInfo.reference.firstName,
        middleName: oaInfo.reference.middleName || 
        "",
        lastName: oaInfo.reference.lastName,
        relationship: oaInfo.reference?.relationship,
        phone: oaInfo.reference.phone || 
        "",
        email: oaInfo.reference.email || 
        "",
      };
    }
    else{
      oaReference = {}; 
    }
    
    try{
      await dispatch(updateOAName(oaName));
      await dispatch(updateOAIdentity(oaIdentity));
      // if (oaInfo.personalInfo.profilePicture) {
      //   const profilePicFile = base64ToFile(oaInfo.personalInfo.profilePicture, 'profilePicture');
      //   await dispatch(updateOAProfilePic(profilePicFile));
      // }
      if (oaInfo.personalInfo.profilePicture && typeof oaInfo.personalInfo.profilePicture === 'object') {
        const { file: profilePicFile, mimeType } = base64ToFile(oaInfo.personalInfo.profilePicture, 'profilePicture');
        await dispatch(updateOAProfilePic(profilePicFile));
      }      
  
      if (oaInfo.document.optReceipt && typeof oaInfo.document.optReceipt === 'object') {
        const { file: optReceiptFile, mimeType } = base64ToFile(oaInfo.document.optReceipt, 'optReceipt');
        const optReceiptFilename = `optReceipt.${mimeType.split('/')[1]}`;
        const document = await dispatch(getUrl(optReceiptFilename, optReceiptFile));
        if (document) {
          await dispatch(addOADocument({ id: onboardingApplicationId, documentId: document._id }));
        }
      }
  
      if (oaInfo.document.driverLicense && typeof oaInfo.document.driverLicense === 'object') {
        const { file: driverLicenseFile, mimeType } = base64ToFile(oaInfo.document.driverLicense, 'driverLicense');
        const driverLicenseFilename = `driverLicense.${mimeType.split('/')[1]}`;
        const document = await dispatch(getUrl(driverLicenseFilename, driverLicenseFile));
        if (document) {
          await dispatch(addOADocument({ id: onboardingApplicationId, documentId: document._id }));
        }
      }
  
      await dispatch(updateOACurrentAddress(oaInfo.address));
      await dispatch(updateOAContactInfo(oaInfo.contactInfo));
      await dispatch(updateOAEmployment(oaEmployment));
      await dispatch(updateOAReference(oaReference));
      await dispatch(updateOAEmergencyContact(oaInfo.emergencyContacts));
      await dispatch(updateOAStatus('Pending'));
      user.instance.onboardingApplication.status = 'Pending';
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem(`oaInfo-${userId}`);
      localStorage.removeItem('currentStep');
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
    }
    setIsSubmitting(false);
  };

  if (isSubmitting) {
    return <div className='pt-[200px] w-2/3 font-bold text-2xl text-center'>Submitting...</div>;
  }

  return (
    <div>
      <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents Summary</h2>
      
      {!personalInfo?.profilePicture && !documentInfo?.optReceipt && !documentInfo?.driverLicense && 
        <div className='text-gray-700 text-md md:text-lg font-normal'>
          <h1 className='mb-4'>
            You don't upload any documents like Profile Picture, OPT Receipt or Driver's License. 
          </h1>
          <h2 className='mb-4'>If you need to edit any other information, Click Previous.</h2>
          <h2 className='mb-4'>  
            If all information looks good to you, then click Submit to finish your application. 
          </h2>
        </div>
      }
      {personalInfo?.profilePicture && (
        <div className="mb-4">
          {/* {console.log(base64ToFile(oaInfo.personalInfo.profilePicture, 'profilePicture'))}; */}
          <p className='text-gray-700 text-md md:text-lg font-normal'>Profile Picture:</p>
          <img src={personalInfo.profilePicture} alt="Profile" className="mb-2"/>
          <button
            type="button"
            className='bg-stone-400 font-semibold text-white border rounded text-center px-4 py-2 text-md md:text-lg grid mx-auto'
            onClick={() => {
              const mimeType = personalInfo.profilePicture.includes('image/jpeg') ? 'image/jpeg' : personalInfo.profilePicture.includes('image/png') ? 'image/png' : 'image/jpg';
              downloadFile(personalInfo.profilePicture, 'profile_picture', mimeType);
            }}
          >
            Download Profile Picture
          </button>
          {/* <hr className="mt-8 mb-4 border-stone-500 border-1 w-full"></hr> */}
        </div>
      )}
      <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
        {documentInfo && (
          <>
            {documentInfo.optReceipt && (
              <div className="mb-4">
                <p className='text-gray-700 text-md md:text-lg font-normal'>OPT Receipt:</p>
                <button
                  type="button"
                  className='bg-stone-400 font-semibold text-white border rounded text-center px-4 py-2 text-md md:text-lg'
                  onClick={() => downloadFile(documentInfo.optReceipt, 'opt_receipt.pdf', 'application/pdf')}
                >
                  Download OPT Receipt
                </button>
              </div>
            )}
            {documentInfo.driverLicense && (
              <div className="mb-4">
                <p className='text-gray-700 text-md md:text-lg font-normal'>Driver License:</p>
                <button
                  type="button"
                  className='bg-stone-400 text-white border rounded text-center px-4 py-2 text-md md:text-lg font-semibold'
                  onClick={() => {
                    const mimeType = documentInfo.driverLicense.includes('application/pdf') ? 'application/pdf' :
                    documentInfo.driverLicense.includes('image/jpeg') ? 'image/jpeg' :
                    documentInfo.driverLicense.includes('image/png') ? 'image/png' :
                    'image/jpg';
                    downloadFile(documentInfo.driverLicense, 'driver_license', mimeType);
                  }}
                >
                  Download Driver License
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className='mt-12 text-gray-700 text-md md:text-lg font-normal'>
        Your previouis documents:
        <hr className="mt-8 mb-4 border-stone-500 border-1 w-full"></hr>
        {Array.isArray(documents) && documents.map((doc: any, index: number) => (
          <div key={index} className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2">
            <div className="md:min-w-36 md:max-w-56">
              {doc.title}
            </div>
            <div>
              <Typography variant="subtitle1" className="hidden md:block">
                {doc.filename}
              </Typography>                                 
            </div>
            <DocViewerComponent key={index} title={doc.title} url={doc.url} type={doc.filename.split('.').pop() || ''} />
          </div>
        ))}
      </div>

      <StepController 
        currentStep={oaInfo.currentStep}
        totalSteps={7}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Summary;
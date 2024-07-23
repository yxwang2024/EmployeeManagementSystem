import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep, updateOAName, updateOAIdentity, updateOACurrentAddress, updateOAContactInfo, updateOAEmployment, updateOAReference, updateOAEmergencyContact, getUrl, addOADocument, updateOAProfilePic } from '../../store/oaInfo';
import { OaNameType, IdentityType, EmploymentType, ReferenceType } from '../../utils/type';

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const Summary: React.FC = () => {
  const dispatch = useDispatch();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [documentInfo, setDocumentInfo] = useState<any>(null);
  const oaInfo = useSelector((state: RootState) => state.oaInfo);

  useEffect(() => {
    const storedData = localStorage.getItem('oaInfo');
    
    if (storedData) {
      const data = JSON.parse(storedData);
      setPersonalInfo(data.personalInfo);
      setDocumentInfo(data.document);
    }
  }, []);

  const downloadFile = (base64Data: string, fileName: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data.split(',')[1]}`;
    link.download = fileName;
    link.click();
  };

  const handleSubmit = async () => {
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
        startDate: '',
        endDate: '',
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
      if (oaInfo.personalInfo.profilePicture) {
        const profilePicFile = base64ToFile(oaInfo.personalInfo.profilePicture, 'profilePicture');
        await dispatch(updateOAProfilePic(profilePicFile));
      }
  
      if (oaInfo.document.optReceipt) {
        const optReceiptFile = base64ToFile(oaInfo.document.optReceipt, 'optReceipt');
        const document = await dispatch(getUrl('optReceipt', optReceiptFile));
        if (document) {
          await dispatch(addOADocument({ id: onboardingApplicationId, documentId: document._id }));
        }
      }
  
      if (oaInfo.document.driverLicense) {
        const driverLicenseFile = base64ToFile(oaInfo.document.driverLicense, 'driverLicense');
        const document = await dispatch(getUrl('driverLicense', driverLicenseFile));
        if (document) {
          await dispatch(addOADocument({ id: onboardingApplicationId, documentId: document._id }));
        }
      }
  
      await dispatch(updateOACurrentAddress(oaInfo.address));
      await dispatch(updateOAContactInfo(oaInfo.contactInfo));
      await dispatch(updateOAEmployment(oaEmployment));
      await dispatch(updateOAReference(oaReference));
      await dispatch(updateOAEmergencyContact(oaInfo.emergencyContacts));
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div>
      <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents Summary</h2>
      
      {!personalInfo?.profilePicture && !documentInfo.optReceipt && !documentInfo.driverLicense && 
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
          <hr className="mt-8 mb-4 border-stone-500 border-1 w-full"></hr>
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
                  className='bg-stone-400 font-semibold text-white border rounded text-center px-4 py-2 text-md md:text-lg font-semibold'
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

      <div className='flex mt-8 mb-32'>
        <button
          type="button"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={() => dispatch(setCurrentStep(6))}
        >
          Previous
        </button>
        <button
          type="button"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Summary;
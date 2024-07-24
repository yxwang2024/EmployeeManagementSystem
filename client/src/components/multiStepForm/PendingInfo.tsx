import React, { useEffect, useState } from 'react';
import { OaInfoState } from '../../store/oaInfo';
import DocViewerComponent from '../DocViewer';
import { Typography } from "@mui/material";

const PendingInfo: React.FC = () => {
  const [applicationInfo, setApplicationInfo] = useState<OaInfoState | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const applicationData = JSON.parse(localStorage.getItem(`oaInfo-${user.id}`) || '{}');
    setApplicationInfo(applicationData);
  }, []);

  if (!applicationInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className='pt-[100px] w-2/3 mx-auto font-bold text-2xl text-center'>
      <p>Please wait for HR to review your application.</p>
      <div className="mt-4 text-left">
        <h2 className="text-xl font-semibold mb-4 mt-10">Your Application Information:</h2>
        
        <table className="text-gray-600 text-lg table-auto w-full border-collapse border border-gray-200 mb-32">
          <thead>
            <tr>
              <th className="text-black border border-gray-200 px-4 py-2">Section</th>
              <th className="text-black border border-gray-200 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Personal Info</td>
              <td className="border border-gray-200 px-4 py-2">
                <p><span className="font-normal">First Name: </span><strong>{applicationInfo.personalInfo.firstName}</strong></p>
                <p><span className="font-normal">Middle Name: </span><strong>{applicationInfo.personalInfo.middleName}</strong></p>
                <p><span className="font-normal">Last Name: </span><strong>{applicationInfo.personalInfo.lastName}</strong></p>
                <p><span className="font-normal">Preferred Name: </span><strong>{applicationInfo.personalInfo.preferredName}</strong></p>
                {/* <p><span className="font-normal">Profile Picture: </span><strong>{applicationInfo.personalInfo.profilePicture}</strong></p> */}
                <p><span className="font-normal">Email: </span><strong>{applicationInfo.personalInfo.email}</strong></p>
                <p><span className="font-normal">SSN: </span><strong>{applicationInfo.personalInfo.ssn}</strong></p>
                <p><span className="font-normal">Date of Birth: </span><strong>{applicationInfo.personalInfo.dob}</strong></p>
                <p><span className="font-normal">Gender: </span><strong>{applicationInfo.personalInfo.gender}</strong></p>
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Address</td>
              <td className="border border-gray-200 px-4 py-2">
                <p><span className="font-normal">Street: </span><strong>{applicationInfo.address.street}</strong></p>
                <p><span className="font-normal">Building: </span><strong>{applicationInfo.address.building}</strong></p>
                <p><span className="font-normal">City: </span><strong>{applicationInfo.address.city}</strong></p>
                <p><span className="font-normal">State: </span><strong>{applicationInfo.address.state}</strong></p>
                <p><span className="font-normal">Zip: </span><strong>{applicationInfo.address.zip}</strong></p>
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Contact Info</td>
              <td className="border border-gray-200 px-4 py-2">
                <p><span className="font-normal">Cell Phone: </span><strong>{applicationInfo.contactInfo.cellPhone}</strong></p>
                <p><span className="font-normal">Work Phone: </span><strong>{applicationInfo.contactInfo.workPhone}</strong></p>
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Work Authorization</td>
              <td className="border border-gray-200 px-4 py-2">
                <p><span className="font-normal">Is Citizen: </span><strong>{applicationInfo.document.isCitizen ? 'Yes' : 'No'}</strong></p>
                <p><span className="font-normal">Visa Title: </span><strong>{applicationInfo.document.visaTitle}</strong></p>
                <p><span className="font-normal">Start Date: </span><strong>{applicationInfo.document.startDate}</strong></p>
                <p><span className="font-normal">End Date: </span><strong>{applicationInfo.document.endDate}</strong></p>
                <p><span className="font-normal">OPT Receipt: </span><strong>{applicationInfo.document.optReceipt}</strong></p>
                <p><span className="font-normal">Other Visa: </span><strong>{applicationInfo.document.otherVisa}</strong></p>
                <p><span className="font-normal">Driver License: </span><strong>{applicationInfo.document.driverLicense}</strong></p>
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Reference</td>
              <td className="border border-gray-200 px-4 py-2">
                <p><span className="font-normal">First Name: </span><strong>{applicationInfo.reference?.firstName}</strong></p>
                <p><span className="font-normal">Middle Name: </span><strong>{applicationInfo.reference?.middleName}</strong></p>
                <p><span className="font-normal">Last Name: </span><strong>{applicationInfo.reference?.lastName}</strong></p>
                <p><span className="font-normal">Relationship: </span><strong>{applicationInfo.reference?.relationship}</strong></p>
                <p><span className="font-normal">Phone: </span><strong>{applicationInfo.reference?.phone}</strong></p>
                <p><span className="font-normal">Email: </span><strong>{applicationInfo.reference?.email}</strong></p>
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Emergency Contacts</td>
              <td className="border border-gray-200 px-4 py-2">
                {applicationInfo.emergencyContacts.map((contact, index) => (
                  <div key={index} className="mb-2">
                    <p><span className="font-normal">First Name: </span><strong>{contact.firstName}</strong></p>
                    <p><span className="font-normal">Middle Name: </span><strong>{contact.middleName}</strong></p>
                    <p><span className="font-normal">Last Name: </span><strong>{contact.lastName}</strong></p>
                    <p><span className="font-normal">Relationship: </span><strong>{contact.relationship}</strong></p>
                    <p><span className="font-normal">Phone: </span><strong>{contact.phone}</strong></p>
                    <p><span className="font-normal">Email: </span><strong>{contact.email}</strong></p>
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <td className="text-black border border-gray-200 px-4 py-2 font-semibold">Documents</td>
              <td className="border border-gray-200 px-4 py-2">
                {applicationInfo.documents.map((doc, index) => (
                  <div key={index} className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2">
                    <div className="md:min-w-36 md:max-w-56">
                      {doc.title}
                    </div>
                    <DocViewerComponent key={index} title={doc.title} url={doc.url} type={doc.title.split('.').pop() || ''} />
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingInfo;
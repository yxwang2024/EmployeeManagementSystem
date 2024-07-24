import React, { useState, useEffect, useCallback } from "react";

import { Box, Button, Typography, TextField } from "@mui/material";

import { useParams } from "react-router-dom";
import DocViewerComponent from "../components/DocViewer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import { request } from "../utils/fetch";
import {
  Profile,
  SingleProfileResponseType,
  SingleVisaStatusesResponseType,
  VisaStatusPopulatedType,
} from "../utils/type";
import { GET_PROFILE } from "../services/queries";
import {
  calculateRemainingDays,
  getDateString,
  getLegalName,
} from "../services/dateServices";

const ProfileDetailedView: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const id = useParams().id || "";
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const [profile, setProfile] = useState<Profile | null>(null);

  const getProfile = useCallback(
    async (getProfileId: string) => {
      try {
        const response: SingleProfileResponseType = await request(GET_PROFILE, {
          getProfileId: getProfileId,
        });
        console.log(response);
        setProfile(response.data.getProfile);
      } catch (e) {
        console.log(e);
        showMessage(String(e));
      }
    },
    [user]
  );
  useEffect(() => {
    showLoading(true);
    getProfile(id)
      .then(() => {
        delayFunctionCall(showLoading, 300, false);
      })
      .catch((error) => {
        console.error(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        // navigate('/login');
      });
  }, [getProfile]);

  // const profile = {
  //   id: "111",
  //   email: "a@a.com",
  //   name: {
  //     firstName: "Aa",
  //     middleName: "Bb",
  //     lastName: "Cc",
  //     preferredName: "Abc",
  //   },
  //   profilePicture:
  //     "https://chuwa-proj2.s3.amazonaws.com/1b94fe3c-c462-48f1-b22f-e5440aae2cda-profilePicture",
  //   identity: {
  //     ssn: "123456789",
  //     dob: "1990-01-01",
  //     gender: "female",
  //   },
  //   currentAddress: {
  //     street: "123 4th Ave",
  //     building: "Apt 567",
  //     city: "Acity",
  //     state: "AA",
  //     zip: "12345",
  //   },
  //   contactInfo: {
  //     cellPhone: "1234567890",
  //     workPhone: "1234567890",
  //   },
  //   employment: {
  //     visaTitle: "F1(CPT/OPT)",
  //     startDate: "2023-01-01",
  //     endDate: "2024-01-01",
  //   },
  //   reference: {
  //     firstName: "AA",
  //     lastName: "BB",
  //     middleName: "CC",
  //     phone: "1234567890",
  //     email: "b@b.com",
  //     relationship: "friend",
  //   },
  //   emergencyContacts: [
  //     {
  //       id: "111",
  //       firstName: "EE",
  //       lastName: "RR",
  //       middleName: "TT",
  //       phone: "1234567890",
  //       email: "c@c.com",
  //       relationship: "friend",
  //     },
  //     {
  //       id: "222",
  //       firstName: "EE",
  //       lastName: "RR",
  //       middleName: "",
  //       relationship: "workmate",
  //     },
  //   ],
  //   documents: [
  //     {
  //       _id: "66988b44c349816da48ecd10",
  //       title: "OPT Receipt",
  //       timestamp: "2024-07-18T03:25:56.753+00:00",
  //       filename: "LeaseHCV.pdf",
  //       url: "https://chuwaems.s3.us-east-2.amazonaws.com/7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
  //       key: "7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
  //     },
  //   ],
  // };
  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
      {profile && (
        <>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg mb-12">
            <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
              Employee Profile
            </h1>
            <div className="flex items-center w-full">
              <div className="w-full flex-col items-center">
                <div className="flex justify-between items-center w-full md:w-2/3 mb-4">
                  <Typography variant="body1">
                    <b>Legal Name:</b>
                  </Typography>
                  <Typography variant="body1">
                    {getLegalName(
                      profile.name.firstName,
                      profile?.name.middleName,
                      profile?.name.lastName
                    )}
                  </Typography>
                </div>
                {profile.name.preferredName && (
                  <div className="flex justify-between items-center w-full md:w-2/3 mb-4">
                    <Typography variant="body1">
                      <b>Preferred Name:</b>
                    </Typography>
                    <Typography variant="body1">
                      {profile?.name.preferredName}
                    </Typography>
                  </div>
                )}
                <div className="flex justify-between items-center w-full md:w-2/3 mb-4">
                  <Typography variant="body1">
                    <b>Email:</b>
                  </Typography>
                  <Typography variant="body1">{profile?.email}</Typography>
                </div>
              </div>
              {profile.profilePicture&&profile.profilePicture!="placeholder" ? (
                <Box
                  component="img"
                  sx={{ height: 150, width: 150 }}
                  mr={10}
                  alt="profilePicture"
                  src={profile.profilePicture}
                />
              ) : (
                <Box sx={{ height: 150, width: 150 }} mr={10} />
              )}
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Identity:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">SSN:</Typography>
                  <Typography variant="body1">
                    {profile?.identity.ssn}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Date of Birth:</Typography>
                  <Typography variant="body1">
                    {getDateString(profile?.identity.dob)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Gender:</Typography>
                  <Typography variant="body1">
                    {profile?.identity.gender}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="body1">
                <b>Work Authorization:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Title:</Typography>
                  <Typography variant="body1">
                    {profile?.employment.visaTitle}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Start date:</Typography>
                  <Typography variant="body1">
                    {getDateString(profile?.employment.startDate)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">End date:</Typography>
                  <Typography variant="body1">
                    {getDateString(profile?.employment.endDate)}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="body1">
                <b>Contact Info:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Cell Phone:</Typography>
                  <Typography variant="body1">
                    {profile?.contactInfo.cellPhone}
                  </Typography>
                </div>
                {profile.contactInfo.workPhone && (
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Work Phone:</Typography>
                    <Typography variant="body1">
                      {profile?.contactInfo.workPhone}
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="body1">
                <b>Current Address:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Street:</Typography>
                  <Typography variant="body1">
                    {profile?.currentAddress.street}
                  </Typography>
                </div>
                {profile.currentAddress.building && (
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Building:</Typography>
                    <Typography variant="body1">
                      {profile?.currentAddress.building}
                    </Typography>
                  </div>
                )}
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">City:</Typography>
                  <Typography variant="body1">
                    {profile?.currentAddress.city}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">State:</Typography>
                  <Typography variant="body1">
                    {profile?.currentAddress.state}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Zip:</Typography>
                  <Typography variant="body1">
                    {profile?.currentAddress.zip}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="body1">
                <b>Reference:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Name:</Typography>
                  <Typography variant="body1">
                    {getLegalName(
                      profile?.reference.firstName,
                      profile?.reference.middleName,
                      profile?.reference.lastName
                    )}
                  </Typography>
                </div>
                {profile.reference.email && (
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Email:</Typography>
                    <Typography variant="body1">
                      {profile?.reference.email}
                    </Typography>
                  </div>
                )}
                {profile.reference.phone && (
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Phone:</Typography>
                    <Typography variant="body1">
                      {profile?.reference.phone}
                    </Typography>
                  </div>
                )}
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Relationship:</Typography>
                  <Typography variant="body1">
                    {profile?.reference.relationship}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="body1">
                <b>Emergency Contacts:</b>
              </Typography>
              {profile?.emergencyContacts.map((contact) => (
                <div className="flex flex-col justify-start ml-4 mt-4 border-2 p-2">
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Name:</Typography>
                    <Typography variant="body1">
                      {getLegalName(
                        contact.firstName,
                        contact.middleName,
                        contact.lastName
                      )}
                    </Typography>
                  </div>
                  {contact.email && (
                    <div className="flex justify-between items-center w-full md:w-1/2">
                      <Typography variant="body1">Email:</Typography>
                      <Typography variant="body1">{contact.email}</Typography>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex justify-between items-center w-full md:w-1/2">
                      <Typography variant="body1">Phone:</Typography>
                      <Typography variant="body1">{contact.phone}</Typography>
                    </div>
                  )}
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Relationship:</Typography>
                    <Typography variant="body1">
                      {contact.relationship}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
            <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
              Documents
            </h1>
            <div className="flex space-x-4 justify-start">
              <div className="flex flex-col items-center space-y-4 w-full">
                {profile?.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2"
                  >
                    <div className="md:min-w-36 md:max-w-56">{doc.title}</div>
                    <div>
                      <Typography
                        variant="subtitle1"
                        className="hidden md:block"
                      >
                        {doc.filename}
                      </Typography>
                    </div>
                    <DocViewerComponent
                      key={index}
                      title={doc.title}
                      url={doc.url}
                      type={doc.filename.split(".").pop() || ""}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDetailedView;

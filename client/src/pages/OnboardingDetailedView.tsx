import { Box, Button, Typography, TextField } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DocViewerComponent from "../components/DocViewer";
import { useAppSelector } from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import {
  SingleOnboardingResponseType,
  OnboardingApplication,
} from "../utils/type";
import {
  GET_ONBOARDING,
  APPROVE_ONBOARDING,
  REJECT_ONBOARDING,
  UPDATE_ONBOARDING_HR_FEEDBACK,
  UPDATE_PROFILE_BY_OAID
} from "../services/queries";
import { request } from "../utils/fetch";
import {
  getDateString,
  getLegalName,
} from "../services/dateServices";
import ErrorPage from "./Error";

const OnboardingDetailedView = () => {
  const user = useAppSelector((state) => state.auth.user);
  const id = useParams().id || "";
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();
  const [expandFeedback, setExpandFeedback] = useState(false);

  const [onboarding, setOnboarding] = useState<OnboardingApplication | null>(
    null
  );

  const [feedback, setFeedback] = useState("");

  const getOnboarding = useCallback(
    async (oaId: string) => {
      try {
        const response: SingleOnboardingResponseType = await request(
          GET_ONBOARDING,
          {
            oaId: oaId,
          }
        );
        setOnboarding(response.data.getOnboardingApplication);
      } catch (e) {
        console.log(e);
        showMessage(String(e));
      }
    },
    [user]
  );

  const approveOnboarding = async () => {
    try {
      const response = await request(APPROVE_ONBOARDING, {
        input: { id: id, status: "Approved" },
      });
      console.log("Approve Response:", response);

      const updateProfileResponse = await request(UPDATE_PROFILE_BY_OAID, {
        oaId:id
      });
      console.log("updateProfileResponse:", updateProfileResponse);

    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const rejectOnboarding = async () => {
    try {
      const response = await request(REJECT_ONBOARDING, {
        input: { id: id, status: "Rejected"},
      });
      console.log("Reject Response:", response);
      const feedbackResponse = await request(UPDATE_ONBOARDING_HR_FEEDBACK, {
        input: { id: id, hrFeedback: feedback },
      });
      console.log("Feedback Response:", feedbackResponse);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  useEffect(() => {
    showLoading(true);
    getOnboarding(id)
      .then(() => {
        delayFunctionCall(showLoading, 300, false);
      })
      .catch((error) => {
        console.error(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        // navigate('/login');
      });
  }, [getOnboarding]);

  const handleApprove = () => {
    approveOnboarding();
    navigate(`/hiring-management`);
  };

  const handleFeedBackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const feedback = e.target.value;
    setFeedback(feedback);
  };

  const handleReject = () => {
    rejectOnboarding();
    navigate(`/hiring-management`);
  };

  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
      {onboarding ? (
        <>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg">
            <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
              Review Visa Status
            </h1>
            <div className="flex justify-between items-center w-full md:w-1/2 mb-4">
              <Typography variant="body1">
                <b>Name:</b>
              </Typography>
              <Typography variant="body1">
                {getLegalName(
                  onboarding?.name.firstName,
                  onboarding?.name.middleName,
                  onboarding?.name.lastName
                )}
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full md:w-1/2 mb-4">
              <Typography variant="body1">
                <b>Profile Picture:</b>
              </Typography>
              {
                onboarding?.profilePicture === "placeholder" ? (
                  <Typography variant="body1">No profile picture uploaded</Typography>
                ) : (
                  <img
                    src={onboarding?.profilePicture}
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />
                )
              }
            </div>
            <div className="flex justify-between items-center w-full md:w-1/2 mb-4">
              <Typography variant="body1">
                <b>Email:</b>
              </Typography>
              <Typography variant="body1">{onboarding?.email}</Typography>
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Identity:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">SSN:</Typography>
                  <Typography variant="body1">
                    {onboarding?.identity.ssn.slice(0, 3) +
                      " " +
                      onboarding?.identity.ssn.slice(3, 5) +
                      " " +
                      onboarding?.identity.ssn.slice(5)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Date Of Birth:</Typography>
                  <Typography variant="body1">
                    {getDateString(onboarding?.identity.dob)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Gender:</Typography>
                  <Typography variant="body1">
                    {onboarding?.identity.gender}
                  </Typography>
                </div>
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
                    {onboarding?.currentAddress.street}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Building:</Typography>
                  <Typography variant="body1">
                    {onboarding?.currentAddress.building}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">City:</Typography>
                  <Typography variant="body1">
                    {onboarding?.currentAddress.city}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">State:</Typography>
                  <Typography variant="body1">
                    {onboarding?.currentAddress.state}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Zip:</Typography>
                  <Typography variant="body1">
                    {onboarding?.currentAddress.zip}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Contact Information:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Cell Phone:</Typography>
                  <Typography variant="body1">
                    {onboarding?.contactInfo.cellPhone}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Work Phone:</Typography>
                  <Typography variant="body1">
                    {onboarding?.contactInfo.workPhone}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Employment:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Visa Title:</Typography>
                  <Typography variant="body1">
                    {onboarding?.employment.visaTitle}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Start Date:</Typography>
                  <Typography variant="body1">
                    {getDateString(onboarding?.employment.startDate)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">End Date:</Typography>
                  <Typography variant="body1">
                    {getDateString(onboarding?.employment.endDate)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Reference:</b>
              </Typography>
              {onboarding?.reference &&
              onboarding?.reference.firstName &&
              onboarding?.reference.lastName ? (
                <div className="flex flex-col justify-start ml-4">
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Name:</Typography>
                    <Typography variant="body1">
                      {getLegalName(
                        onboarding?.reference.firstName,
                        onboarding?.reference.middleName,
                        onboarding?.reference.lastName
                      )}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Phone:</Typography>
                    <Typography variant="body1">
                      {onboarding?.reference.phone}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Email:</Typography>
                    <Typography variant="body1">
                      {onboarding?.reference.email}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center w-full md:w-1/2">
                    <Typography variant="body1">Relationship:</Typography>
                    <Typography variant="body1">
                      {onboarding?.reference.relationship}
                    </Typography>
                  </div>
                </div>
              ) : (
                <Typography variant="body1">No reference provided</Typography>
              )}
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Emergency Contacts:</b>
              </Typography>
              {onboarding?.emergencyContacts &&
              onboarding?.emergencyContacts.length > 0 ? (
                <div className="flex flex-col justify-start ml-4">
                  {onboarding?.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center w-full md:w-1/2"
                    >
                      <Typography variant="body1">
                        {getLegalName(
                          contact.firstName,
                          contact.middleName,
                          contact.lastName
                        )}
                      </Typography>
                      <div className="flex flex-col justify-start">
                        <Typography variant="body1">{contact.phone}</Typography>
                        <Typography variant="body1">{contact.email}</Typography>
                        <Typography variant="body1">{contact.relationship}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body1">No emergency contacts provided</Typography>
              )}
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex justify-between items-center w-full md:w-1/2">
                <Typography variant="body1">
                  <b>Application Status:</b>
                </Typography>
                <Typography
                  variant="body1"
                  // color based on status: Approved - green, Pending - blue, Rejected - red, review - yellow
                  color={
                    onboarding?.status === "Approved"
                      ? "success.light"
                      : onboarding?.status === "Pending"
                      ? "info.light"
                      : onboarding?.status === "Rejected"
                      ? "error.light"
                      : "warning.light"
                  }
                >
                  {onboarding?.status}
                </Typography>
              </div>
            </div>
          </div>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
            <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
              Documents
            </h1>
            <div className="flex space-x-4 justify-start">
              {
                onboarding?.documents.length === 0 ? (
                  <div className="flex flex-col items-center space-y-4 w-full h-32 justify-center">
                    <Typography variant="body1">No documents uploaded.....</Typography>
                  </div>
                ) : (
              <div className="flex flex-col items-center space-y-4 w-full">
                {onboarding?.documents.map((doc, index) => (
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
              )}
            </div>
          </div>
        </>
      ) : (
        <ErrorPage />
      )}

      {onboarding?.status === "pending" && onboarding?.hrFeedback && (
        <div className="flex items-center space-x-2">
          <p>HR Feedback: {onboarding?.hrFeedback}</p>
        </div>
      )}
      <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
        {
          onboarding?.status === "NotSubmitted" && (
            <div className="flex items-center space-x-2 w-full justify-center">
              <Typography variant="body1">Not Submitted, waiting for submission</Typography>
            </div>
          )
        }
        {
          onboarding?.status === "Approved" && (
            <div className="flex items-center space-x-2 w-full justify-center">
              <Typography variant="body1">Approved, No further action needed</Typography>
            </div>
          )
        }
        {
          onboarding?.status === "Rejected" && (
            <div className="flex flex-col items-center space-y-2 w-full justify-center">
              <Typography variant="body1">Rejected, waiting for resubmission</Typography>
              <Typography variant="body1">HR Feedback: {onboarding?.hrFeedback}</Typography>
            </div>
          )
        }
        {onboarding?.status === "Pending" && !expandFeedback && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button variant="contained" color="success" onClick={handleApprove}>
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setExpandFeedback(true)}
            >
              reject
            </Button>
          </Box>
        )}
        {onboarding?.status === "Pending" && expandFeedback && (
          <div className="flex items-center w-full ">
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="HR Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={handleFeedBackInput}
            />
            <div className="ml-4">
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                >
                  Submit Rejection
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setExpandFeedback(false)}
                >
                  Cancel
                </Button>
              </Box>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingDetailedView;

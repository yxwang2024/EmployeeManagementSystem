import { Box, Button, Typography, TextField } from "@mui/material";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DocViewerComponent from "../components/DocViewer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  fetchVisaStatus,
  uploadDocument,
  reUploadDocument,
  moveToNextStep,
} from "../store/slices/employee";
import { VisaStatusType } from "../utils/type";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import {
  SingleVisaStatusesResponseType,
  VisaStatusPopulatedType,
} from "../utils/type";
import {
  GET_VISA_STATUS,
  APPROVE_VISA_STATUS,
  REJECT_VISA_STATUS,
  SEND_NOTIFICATION
} from "../services/queries";
import { request } from "../utils/fetch";
import {
  calculateRemainingDays,
  getDateString,
  getLegalName,
} from "../services/dateServices";
import { nextStep } from "../services/records";

const VisaStatusDetailedView: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const option = useAppSelector((state) => state.option.value);
  const id = useParams().id || "";
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();
  const [expandFeedback, setExpandFeedback] = useState(false);
  const [visaStatus, setVisaStatus] = useState<VisaStatusPopulatedType | null>(
    null
  );
  const [feedback, setFeedback] = useState("");

  const getVisaStatus = useCallback(
    async (getVisaStatusId: string) => {
      try {
        const response: SingleVisaStatusesResponseType = await request(
          GET_VISA_STATUS,
          {
            getVisaStatusId: getVisaStatusId,
          }
        );
        setVisaStatus(response.data.getVisaStatus);
      } catch (e) {
        console.log(e);
        showMessage(String(e));
      }
    },
    [user]
  );

  const sendEmail = async (email:string, nextStep:string) => {
    try {
      const response = await request(SEND_NOTIFICATION, {
        notificationInput: {
          email: email,
          nextStep: nextStep,
        },
      });
      console.log("Send Notification Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };


  const approveVisaStatus = async () => {
    try {
      const response = await request(APPROVE_VISA_STATUS, {
        approveVisaStatusId: id,
      });
      console.log("Approve Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const rejectVisaStatus = async () => {
    try {
      const response = await request(REJECT_VISA_STATUS, {
        rejectVisaStatusId: id,
        hrFeedback: feedback,
      });
      console.log("Reject Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const sendNotification = (email: string, step: string, status: string) => {
    console.log(`SEND EMAIL TO ${email} WHILE ${step} ${status}`);
    const next = nextStep[step][status];
    sendEmail(email,next);
  };


  useEffect(() => {
    showLoading(true);
    getVisaStatus(id)
      .then(() => {
        delayFunctionCall(showLoading, 300, false);
      })
      .catch((error) => {
        console.error(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        // navigate('/login');
      });
  }, [getVisaStatus]);

  const handleApprove = () => {
    approveVisaStatus();
    navigate(`/visa-status-management`);
  };

  const handleFeedBackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const feedback = e.target.value;
    setFeedback(feedback);
  };

  const handleReject = () => {
    rejectVisaStatus();
    navigate(`/visa-status-management`);
  };

  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
      {visaStatus?.workAuthorization.title === "F1(CPT/OPT)" ? (
        <>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg">
            {option == "InProgress" ? (
              <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
                Review Visa Status In Progress
              </h1>
            ) : (
              <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
                Review Visa Status Documents
              </h1>
            )}

            <div className="flex justify-between items-center w-full md:w-1/2 mb-4">
              <Typography variant="body1">
                <b>Name:</b>
              </Typography>
              <Typography variant="body1">
                {getLegalName(
                  visaStatus?.employee.profile.name.firstName,
                  visaStatus?.employee.profile.name.middleName,
                  visaStatus?.employee.profile.name.lastName
                )}
              </Typography>
            </div>
            <div className="mb-4">
              <Typography variant="body1">
                <b>Work Authorization:</b>
              </Typography>
              <div className="flex flex-col justify-start ml-4">
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Title:</Typography>
                  <Typography variant="body1">
                    {visaStatus?.workAuthorization.title}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">Start date:</Typography>
                  <Typography variant="body1">
                    {getDateString(visaStatus?.workAuthorization.startDate)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">End date:</Typography>
                  <Typography variant="body1">
                    {getDateString(visaStatus?.workAuthorization.endDate)}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">
                    Num of Days Remaining:
                  </Typography>
                  <Typography variant="body1">
                    {calculateRemainingDays(
                      visaStatus?.workAuthorization.endDate
                    )}{" "}
                    days
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex justify-between items-center w-full md:w-1/2">
                <Typography variant="body1">
                  <b>Next Step:</b>
                </Typography>
                <Typography
                  variant="body1"
                  // color based on status: Approved - green, Pending - blue, Rejected - red, review - yellow
                  color={
                    visaStatus?.status === "Approved"
                      ? "success.light"
                      : visaStatus?.status === "Pending"
                      ? "info.light"
                      : visaStatus?.status === "Rejected"
                      ? "error.light"
                      : "warning.light"
                  }
                >
                  {nextStep[visaStatus?.step][visaStatus?.status]}
                </Typography>
              </div>
            </div>
          </div>
          {visaStatus.status == "Pending" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
                Documents Waiting For Review
              </h1>
              {visaStatus.documents.at(-1) && (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2">
                    <div className="md:min-w-36 md:max-w-56">
                      {visaStatus.documents.at(-1)?.title}
                    </div>
                    <div>
                      <Typography
                        variant="subtitle1"
                        className="hidden md:block"
                      >
                        {visaStatus.documents.at(-1)?.filename}
                      </Typography>
                    </div>
                    <DocViewerComponent
                      title={visaStatus.documents.at(-1)?.title || ""}
                      url={visaStatus.documents.at(-1)?.url || ""}
                      type={
                        visaStatus.documents
                          .at(-1)
                          ?.filename.split(".")
                          .pop() || ""
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {visaStatus.status == "Approved" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <Typography variant="body1">
                All submitted documents have been approved.
              </Typography>
            </div>
          )}
          {visaStatus.status == "Rejected" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <Typography variant="body1">
                There are rejected documents. Notice employee to reupload the
                document.
              </Typography>
              {visaStatus.hrFeedback && (
                <Typography variant="body1">
                  HR Feedback: {visaStatus.hrFeedback}
                </Typography>
              )}
            </div>
          )}
          {visaStatus.status == "Approved" && option == "All" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
                Approved Documents
              </h1>
              <div className="flex space-x-4 justify-start">
                <div className="flex flex-col items-center space-y-4 w-full">
                  {visaStatus?.documents.map((doc, index) => (
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
          )}
          {(visaStatus.status == "Pending" ||
            visaStatus.status == "Rejected") &&
            option == "All" && (
              <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
                {visaStatus?.documents.length <= 1 ? (
                  <Typography variant="body1">
                    There is no approved documents.
                  </Typography>
                ) : (
                  <>
                    <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
                      Approved Documents
                    </h1>
                    <div className="flex space-x-4 justify-start">
                      <div className="flex flex-col items-center space-y-4 w-full">
                        {visaStatus?.documents
                          .slice(0, -1)
                          .map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2"
                            >
                              <div className="md:min-w-36 md:max-w-56">
                                {doc.title}
                              </div>
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
                  </>
                )}
              </div>
            )}

          {visaStatus.status == "Pending" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              {!expandFeedback && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApprove}
                  >
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
              {expandFeedback && (
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
          )}
          {visaStatus.status == "Approved" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => {
                    sendNotification(
                      visaStatus.employee.email,
                      visaStatus.step,
                      visaStatus.status
                    );
                  }}
                >
                  Send Email
                </Button>
              </Box>
            </div>
          )}
          {visaStatus.status == "Rejected" && option == "InProgress" && (
            <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => {
                    sendNotification(
                      visaStatus.employee.email,
                      visaStatus.step,
                      visaStatus.status
                    );
                  }}
                >
                  Send Email
                </Button>
              </Box>
            </div>
          )}
        </>
      ) : (
        <div className="w-11/12 h-4/5 p-8">
          <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
            Not employee with F1(CPT/OPT) Visa.
          </h1>
        </div>
      )}
    </div>
  );
};

export default VisaStatusDetailedView;

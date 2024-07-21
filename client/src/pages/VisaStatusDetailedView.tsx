import { Box, Button, IconButton, Typography, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import DocViewerComponent from "../components/DocViewer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import { EmployeeInstanceType } from "../utils/type";

const approveMessages: Record<string, Record<string, string>> = {
  "OPT Receipt": {
    Reviewing: "Waiting for HR to approve your OPT Receipt",
    Approved: "Please upload a copy of your OPT EAD",
  },
  "OPT EAD": {
    Reviewing: "Waiting for HR to approve your OPT EAD",
    Approved: "Please download and fill out the I-983 form",
  },
  "I-983": {
    Reviewing: "Waiting for HR to approve your I-983 form",
    Approved:
      "Please send the I-983 along with all necessary documents to your school and upload the new I-20",
  },
  I20: {
    Reviewing: "Waiting for HR to approve your I-20",
    Approved: "All documents have been approved!",
  },
};

const VisaStatusDetailedView = () => {
  // const navigate = useNavigate();
  // const [file, setFile] = useState<File | null>(null);
  // const [fileName, setFileName] = useState<string | null>(null);
  // const { showLoading, showMessage } = useGlobal();
  const [expandFeedback, setExpandFeedback] = useState(false);

  // const dispatch = useAppDispatch();
  // const user = useAppSelector((state) => state.auth.user);
  // const visaStatus: VisaStatusType = useAppSelector(
  //   (state) => state.employee.visaStatus
  // );
  const visaStatus = {
    employee: {
      profile: {
        email: "employee@gmail.com",
        name: {
          firstName: "John",
          middleName: "Cake",
          lastName: "Doe",
          preferredName: "JD",
        },
      },
    },
    step: "I20",
    status: "Reviewing",
    hrFeedback: "Invalid Receipt.",
    workAuthorization: {
      title: "F1(CPT/OPT)",
      startDate: "2024-04-15",
      endDate: "2025-04-14",
    },
    documents: [
      {
        _id: "66988b44c349816da48ecd10",
        title: "OPT Receipt",
        timestamp: "2024-07-18",
        filename: "LeaseHCV.pdf",
        url: "https://chuwaems.s3.us-east-2.amazonaws.com/7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
        key: "7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
      },
      {
        _id: "66988b44c349816da48ecd10",
        title: "OPT Receipt",
        timestamp: "2024-07-18",
        filename: "LeaseHCV.pdf",
        url: "https://chuwaems.s3.us-east-2.amazonaws.com/7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
        key: "7a9195b3-194e-4a8e-863b-4f0d56bae862-LeaseHCV.pdf",
      },
    ],
  };

  //useEffect(() => {
  // if (!user) {
  //   // || user.role !== "HR") {
  //   navigate("/login");
  //   return;
  // }
  // const EmployeeId = user.instance.id;
  // showLoading(true);
  // dispatch(fetchVisaStatus(EmployeeId))
  //   .then(() => {
  //     delayFunctionCall(showLoading, 300, false);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     showMessage(`failed to fetch visa status`, "failed", 2000);
  //     showLoading(false);
  //     navigate("/login");
  //   });
  //}, [user]);

  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
      {visaStatus.workAuthorization.title === "F1(CPT/OPT)" ? (
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
                {visaStatus?.employee.profile.name.firstName}
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
                    {visaStatus?.workAuthorization.startDate}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">End date:</Typography>
                  <Typography variant="body1">
                    {visaStatus?.workAuthorization.endDate}
                  </Typography>
                </div>
                <div className="flex justify-between items-center w-full md:w-1/2">
                  <Typography variant="body1">
                    Num of Days Remaining:
                  </Typography>
                  <Typography variant="body1">300 days</Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex justify-between items-center w-full md:w-1/2">
                <Typography variant="body1">
                  <b>Current Step:</b>
                </Typography>
                <Typography variant="body1">{visaStatus?.step}</Typography>
              </div>
              <div className="flex justify-between items-center w-full md:w-1/2">
                <Typography variant="body1">
                  <b>Status:</b>
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
                  {visaStatus?.status}
                </Typography>
              </div>
            </div>
          </div>
          <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
            <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
              Documents
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
        </>
      ) : (
        <div className="w-11/12 h-4/5 p-8">
          <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
            Not employee with F1(CPT/OPT) Visa.
          </h1>
        </div>
      )}

      {visaStatus?.status === "pending" && visaStatus?.hrFeedback && (
        <div className="flex items-center space-x-2">
          <p>HR Feedback: {visaStatus?.hrFeedback}</p>
        </div>
      )}
      <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
        {visaStatus?.status === "Reviewing" && !expandFeedback && (
          <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={2}>
            <Button variant="contained" color="success">Approve</Button>
            <Button variant="contained" color="error" onClick={() => setExpandFeedback(true)}>reject</Button>
          </Box>
        )}
        {visaStatus?.status === "Reviewing" && expandFeedback && (
          <div className="flex items-center w-full ">
        
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="HR Feedback"
              multiline
              rows={4}
            />
      <div className="ml-4">
            <Box display="flex" flexDirection="column" gap={2}>
              <Button size="small" variant="contained" color="error">Submit Rejection</Button>
              <Button size="small" variant="contained" onClick={() => setExpandFeedback(false)}>Cancel</Button>
            </Box>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaStatusDetailedView;

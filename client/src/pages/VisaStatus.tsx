import {
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, {useState, useEffect } from "react";
import DocViewerComponent from "../components/DocViewer";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchVisaStatus, uploadDocument, reUploadDocument, moveToNextStep } from "../store/slices/employee";
import { VisaStatusType } from "../utils/type";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";

const approveMessages: Record<string, Record<string, string>> = {
  "OPT Receipt": {
    "Reviewing": "Waiting for HR to approve your OPT Receipt",
    "Approved": "Please upload a copy of your OPT EAD",
  },
  "OPT EAD": {
    "Reviewing": "Waiting for HR to approve your OPT EAD",
    "Approved": "Please download and fill out the I-983 form",
  },
  "I-983": {
    "Reviewing": "Waiting for HR to approve your I-983 form",
    "Approved": "Please send the I-983 along with all necessary documents to your school and upload the new I-20",
  },
  "I20": {
    "Reviewing": "Waiting for HR to approve your I-20",
    "Approved": "All documents have been approved!",
  },
};


const VisaStatus: React.FC = () => {
  const navigate = useNavigate(); 
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { showLoading, showMessage } = useGlobal();

  const dispatch = useAppDispatch();
  const visaStatus: VisaStatusType = useAppSelector((state) => state.employee.visaStatus);

  useEffect(() => { 
    const EmployeeId = "66984ab27070f38efac60db4"; // get this from redux
    showLoading(true);
    dispatch(fetchVisaStatus(EmployeeId)).then(() => {
      delayFunctionCall(showLoading, 300, false);
    }).catch((error) => {
      console.error(error);
      showMessage(`failed to fetch visa status`, "failed", 2000);
      showLoading(false);
      navigate('/login');
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleUpload = () => {
    if (file) {
      // Implement your upload logic here
      console.log("Uploading file:", file);
      showLoading(true);
      dispatch(uploadDocument(visaStatus.step, file)).then(() => {
        // reset file input
        setFile(null);
      }).then(() => {
        delayFunctionCall(showLoading, 300, false);
      }).catch((error) => {
        showMessage("Failed to upload document", error);
        showLoading(false);
      });
    } else {
      console.log("No file selected");
    }
  };

  const handleReUpload = () => {
    if (file) {
      // Implement your upload logic here
      console.log("Re-Uploading file:", file);
      dispatch(reUploadDocument(visaStatus.step, file)).then(() => {
        // reset file input
        delayFunctionCall(showLoading, 300, false);
        setFile(null);
      }).catch((error) => {
        showMessage("Failed to re-upload document", error);
        showLoading(false);
      });
    } else {
      console.log("No file selected");
    }
  }

  const handleGoNext = () => {
    showLoading(true);
    dispatch(moveToNextStep(visaStatus._id)).then(() => {
      delayFunctionCall(showLoading, 300, false);
    }).catch((error) => {
      showMessage("Failed to move to next step", error);
      showLoading(false);
    });
  }

  const handleReset = () => {
    setFile(null);
    setFileName(null);
  };

  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
      { visaStatus.workAuthorization.title === "F1(CPT/OPT)" ? (
        <>
      <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          Current Visa Status
        </h1>
        <div className="flex flex-col justify-start">
          <div className="flex justify-between items-center w-full md:w-1/2">
            <Typography variant="body1">Current Step:</Typography>
            <Typography variant="body1">{visaStatus?.step}</Typography>
          </div>
          <div className="flex justify-between items-center w-full md:w-1/2">
            <Typography variant="body1">Status:</Typography>
            <Typography variant="body1" 
            // color based on status: Approved - green, Pending - blue, Rejected - red, review - yellow
              color={visaStatus?.status === "Approved" ? "success.light" : visaStatus?.status === "Pending" ? "info.light" : visaStatus?.status === "Rejected" ? "error.light" : "warning.light"}
              >
              {visaStatus?.status}
            </Typography>
          </div>
          <div className="flex justify-start items-center w-full md:w-auto pt-4 space-x-4">
            <Typography variant="body1" color="primary.light">
              {approveMessages[visaStatus?.step][visaStatus?.status]}
            </Typography>
            {visaStatus?.status === "Approved" && visaStatus?.step!=="I20" && (
              <Button
                variant="contained"
                color="success"
                size="medium"
                sx={{width: "2.5rem", height: "2.5rem"}}
                onClick={handleGoNext}
              >
                Next
              </Button>
            )
            }
          </div>
          {
            // empty tenant template and sample template for download
            visaStatus?.step === "I-983" && visaStatus?.status === "Pending" && (
              <div className="flex items-center space-x-4">
                <a href="https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">Download Template</a>
                <a href="https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">Download Sample</a>
              </div>
              
            )
          }
          {
            visaStatus?.hrFeedback && (
              <div className="flex items-center space-x-2">
                <p>HR Feedback: {visaStatus?.hrFeedback}</p>
              </div>
            )
          }
        </div>
      </div>
      { visaStatus?.status === "Pending" && (
        <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          Upload
        </h1>
        <div className="flex space-x-4 justify-between">
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {fileName ? <p >{fileName}</p> : <p>No file selected</p>}
              {fileName && (
                <IconButton onClick={handleReset}>
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: { xs: "none", md: "block" } }}
            onClick={handleUploadClick}
          >
            Upload File
          </Button>

          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={handleUploadClick}
          >
            <CloudUploadIcon />
          </IconButton>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Submit
          </Button>
        </div>
      </div>
      )
      }
      { visaStatus?.status === "Rejected" && (
        <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          Re-Upload
        </h1>
        <div className="flex space-x-4 justify-between">
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {fileName ? <p >{fileName}</p> : <p>No file selected</p>}
              {fileName && (
                <IconButton onClick={handleReset}>
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: { xs: "none", md: "block" } }}
            onClick={handleUploadClick}
          >
            Upload File
          </Button>

          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={handleUploadClick}
          >
            <CloudUploadIcon />
          </IconButton>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleReUpload}
            disabled={!file}
          >
            Submit
          </Button>
        </div>
      </div>
      )
      }
      <div className="w-11/12 border p-8 rounded-lg bg-white shadow-lg  mb-12">
        <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
          Documents
        </h1>
        <div className="flex space-x-4 justify-start">
          <div className="flex flex-col items-center space-y-4 w-full">
            {visaStatus?.documents.map((doc, index) => (
              <div key={index} className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2">
                <div>{doc.title}</div>
                <div>
                  <Typography variant="subtitle1" className="hidden md:block">
                    {doc.filename}
                  </Typography>                                 
                </div>
                <DocViewerComponent key={index} title={doc.title} url={doc.url} type={doc.filename.split('.').pop() || ''} />
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      ) : (
        <div className="w-11/12 h-4/5 p-8">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          You are all set!
        </h1>
        </div>
      )}
    </div>
  );
};


export default VisaStatus;

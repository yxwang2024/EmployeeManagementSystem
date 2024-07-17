import {
  Input,
  Button,
  IconButton,
  Typography,
  Box,
  Backdrop,
  Modal,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/Hooks";
import axios from "axios";
import DocViewerComponent from "../components/DocViewer";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// move this to redux
const getVisaStatus = async (EmployeeId: string) => {
  //graphql query to get visa status
  const query = `
    query GetVisaStatusByEmployee($employeeId: ID!) {
      getVisaStatusByEmployee(employeeId: $employeeId) {
        _id
        step
        status
        hrFeedback
        documents {
          _id
          title
          timestamp
          filename
          url
          key
        }
      }
    }
  `;
  try {
    const response = await axios.post("http://localhost:3000/graphql", {
      query,
      variables: {
        employeeId: EmployeeId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.errors) {
      console.log("Response data errors:", response.data.errors);
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.getVisaStatusByEmployee;
  } catch (error) {
    console.error(error);
  }
};

const VisaStatus: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [visaStatus, setVisaStatus] = React.useState<any | null>(null);

  useEffect(() => {
    const EmployeeId = "6696e85177834559490af23a"; // get this from redux
    getVisaStatus(EmployeeId).then((status) => {
      setVisaStatus(status);
    });
  }, []);

  console.log("visaStatus", visaStatus);

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
      // Example: upload to a server
    } else {
      console.log("No file selected");
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName(null);
  };

  const fakeDocuments = [
    {
      title: "OPT Receipt",
      filename: "fake_opt_receipt.pdf",
      url: "https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf",
      type: "pdf",
    },
    {
      title: "OPT EAD",
      filename: "fake_opt_ead.pdf",
      url: "https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf",
      type: "pdf",
    },
    {
      title: "I-94",
      filename: "fake_i94.pdf",
      url: "https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf",
      type: "pdf",
    },
    {
      title: "I-20",
      filename: "fake_i20.pdf",
      url: "https://chuwaems.s3.us-east-2.amazonaws.com/2bb50913-513f-4534-9075-2f1292ff5f5a-LeaseHCV.pdf",
      type: "pdf",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center h-screen bg-gray-100 space-y-4 pt-20 md:pt-24 overflow-y-auto">
      <div className="w-4/5 border p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          Current Visa Status
        </h1>
        <div className="flex flex-col justify-start">
          <div className="flex items-center space-x-2">
            <p>Step: {visaStatus?.step}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p>Status: {visaStatus?.status}</p>
          </div>
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
        <div className="w-4/5 border p-8 rounded-lg bg-white shadow-lg">
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
      <div className="w-4/5 border p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-left text-3xl font-bold mb-10 text-gray-700">
          Documents
        </h1>
        <div className="flex space-x-4 justify-start">
          <div className="flex flex-col items-center space-y-2 w-full">
            {fakeDocuments.map((doc, index) => (
              <div key={index} className="flex items-center flex-row justify-between space-x-2 w-full border-y-2 py-2">
                <div>{doc.title}</div>
                <div>
                  <Typography variant="subtitle1" className="hidden md:block">
                    {doc.filename}
                  </Typography>                                 
                </div>
                <DocViewerComponent key={index} title={doc.title} url={doc.url} type={doc.type} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};


export default VisaStatus;

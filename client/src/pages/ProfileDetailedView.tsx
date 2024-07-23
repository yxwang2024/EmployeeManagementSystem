import React, { useState, useEffect, useCallback } from "react";

import { Box, Button, Typography, TextField } from "@mui/material";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DocViewerComponent from "../components/DocViewer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import { request } from "../utils/fetch";
import {
  SingleVisaStatusesResponseType,
  VisaStatusPopulatedType,
} from "../utils/type";
import {
  GET_VISA_STATUS,
  APPROVE_VISA_STATUS,
  REJECT_VISA_STATUS,
} from "../services/queries";
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

  const profile;
  return (
    <div className="w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto">
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
              profile?.employee.profile.name.firstName,
              profile?.employee.profile.name.middleName,
              profile?.employee.profile.name.lastName
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
                {profile?.workAuthorization.title}
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full md:w-1/2">
              <Typography variant="body1">Start date:</Typography>
              <Typography variant="body1">
                {getDateString(profile?.workAuthorization.startDate)}
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full md:w-1/2">
              <Typography variant="body1">End date:</Typography>
              <Typography variant="body1">
                {getDateString(profile?.workAuthorization.endDate)}
              </Typography>
            </div>
            <div className="flex justify-between items-center w-full md:w-1/2">
              <Typography variant="body1">Num of Days Remaining:</Typography>
              <Typography variant="body1">
                {calculateRemainingDays(profile?.workAuthorization.endDate)}{" "}
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
                profile?.status === "Approved"
                  ? "success.light"
                  : profile?.status === "Pending"
                  ? "info.light"
                  : profile?.status === "Rejected"
                  ? "error.light"
                  : "warning.light"
              }
            >
              {nextStep[profile?.step][profile?.status]}
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
            {profile?.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2"
              >
                <div className="md:min-w-36 md:max-w-56">{doc.title}</div>
                <div>
                  <Typography variant="subtitle1" className="hidden md:block">
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
      {profile?.status === "pending" && profile?.hrFeedback && (
        <div className="flex items-center space-x-2">
          <p>HR Feedback: {profile?.hrFeedback}</p>
        </div>
      )}
      {profile?.status === "Reviewing" && (
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
    </div>
  );
};

export default ProfileDetailedView;

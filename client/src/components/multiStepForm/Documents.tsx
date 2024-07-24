import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { GET_PROFILE_BY_ID } from "../../services/queries";
import { request } from "../../utils/fetch";
import { useGlobal } from "../../store/hooks";
import { delayFunctionCall } from "../../utils/utilities";
import DocViewerComponent from "../DocViewer";
import { Typography } from "@mui/material";

const Documents: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [initialValues, setInitialValues] = useState([]);

  const { showLoading, showMessage } = useGlobal();

  const getProfile = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    const response: any = await request(GET_PROFILE_BY_ID, { userId });
    const profile = response.data.getProfileByUserId;
    setInitialValues(profile.documents);
  }, [user]);

  useEffect(() => {
    showLoading(true);
    getProfile()
      .then(() => delayFunctionCall(showLoading, 300, false))
      .catch(() => {
        showMessage("Failed to fetch profile documents", "failed", 2000);
        showLoading(false);
      });
  }, []);

  return (
    <div className="w-full p-8  mb-12">
      <h2 className="text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10">
        Documents
      </h2>
      <div className="flex flex-col items-center space-y-4 w-full">
        {initialValues.map((doc: any, index: number) => (
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
  );
};

export default Documents;

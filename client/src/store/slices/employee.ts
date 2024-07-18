import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { request, fileUploadRequest } from "../../utils/fetch";
import {
  EmployeeStateType,
  VisaStatusResponseType,
  FileUploadResponseType,
  ReUploadDocumentResponseType,
  AddDocumentResponseType,
  MoveToNextStepResponseType,
} from "../../utils/type";

export const fetchVisaStatus =
  (employee: string) => async (dispatch: AppDispatch) => {
    const query = `
    query GetVisaStatusByEmployee($employeeId: ID!) {
      getVisaStatusByEmployee(employeeId: $employeeId) {
        _id
        step
        status
        hrFeedback
        workAuthorization {
          title
          startDate
          endDate
        }
        documents {
          _id
          title
          timestamp
          filename
          url
          key
        }
        employee
      }
    }
  `;
    try {
      const response: VisaStatusResponseType = await request(query, {
        employeeId: employee,
      });
      const visaStatus = response.data.getVisaStatusByEmployee;
      console.log("res", visaStatus);
      dispatch(updateVisaStatus({ visaStatus: visaStatus }));
    } catch (error) {
      console.error(error);
      // const message = error.errors[0].message;
    }
  };

export const addVisaStatusDocument =
  (employee: string, document: string) => async (dispatch: AppDispatch) => {
    const query = `
    mutation AddDocument($documentId: ID!, $addDocumentId: ID!) {
      addDocument(documentId: $documentId, id: $addDocumentId) {
        _id
        step
        status
        hrFeedback
        workAuthorization {
          title
          startDate
          endDate
        }
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
      console.log("employee", employee, "document", document);
      const response: AddDocumentResponseType = await request(query, {
        documentId: document,
        addDocumentId: employee,
      });
      console.log("res", response);
      const visaStatus = response.data.addDocument;
      dispatch(updateVisaStatus({ visaStatus: visaStatus }));
      // dispatch(fetchVisaStatus(employee));
    } catch (error) {
      console.error(error);
      // const message = error.errors[0].message;
    }
  };

export const uploadDocument =
  (title: string, file: File) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const query = `
      mutation CreateDocument($input: DocumentInput!) {
        createDocument(input: $input) {
          _id
          title
          timestamp
          filename
          url
          key
        }
     }
    `;
    try {
      const response: FileUploadResponseType = await fileUploadRequest(
        query,
        title,
        file
      );
      const employeeId: string = getState().employee.visaStatus.employee;
      dispatch(
        addVisaStatusDocument(employeeId, response.data.createDocument._id)
      );
    } catch (error) {
      console.error(error);
      // const message = error.errors[0].message;
    }
  };

const deleteDocument = (document: string) => async () => {
  const query = `
      mutation Mutation($deleteDocumentId: ID!) {
        deleteDocument(id: $deleteDocumentId)
      }
    `;
  try {
    const response: FileUploadResponseType = await request(query, {
      deleteDocumentId: document,
    });
    console.log("res", response);
  } catch (error) {
    console.error(error);
    // const message = error.errors[0].message;
  }
};

export const reUploadDocument =
  (title: string, file: File) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const query = `
      mutation ReUploadDocument($reUploadDocumentId: ID!, $documentId: ID!) {
        reUploadDocument(id: $reUploadDocumentId, documentId: $documentId) {
          _id
          employee
          step
          status
          hrFeedback
          workAuthorization {
            title
            startDate
            endDate
          }
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
    const uploadQuery = `
      mutation CreateDocument($input: DocumentInput!) {
        createDocument(input: $input) {
          _id
          title
          timestamp
          filename
          url
          key
        }
     }
    `;
    try {
      // delete document
      const documentId = getState().employee.visaStatus.documents.find(
        (doc) => doc.title === title
      )?._id;
      if (documentId) {
        dispatch(deleteDocument(documentId));
      }
      // process upload
      const uploadResponse: FileUploadResponseType = await fileUploadRequest(
        uploadQuery,
        title,
        file
      );
      const docId = uploadResponse.data.createDocument._id;
      console.log("document", uploadResponse.data.createDocument);

      // process re-upload update
      const response: ReUploadDocumentResponseType = await request(query, {
        reUploadDocumentId: getState().employee.visaStatus.employee,
        documentId: docId,
      });
      const visaStatus = response.data.reUploadDocument;
      dispatch(updateVisaStatus({ visaStatus: visaStatus }));
    } catch (error) {
      console.error(error);
      // const message = error.errors[0].message;
    }
  };

export const moveToNextStep =
  (visaStatusId: string) => async (dispatch: AppDispatch) => {
    const query = `
      mutation MoveToNextStep($moveToNextStepId: ID!) {
        moveToNextStep(id: $moveToNextStepId) {
          _id
          step
          status
          hrFeedback
          workAuthorization {
            title
            startDate
            endDate
          }
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
      const response: MoveToNextStepResponseType = await request(query, {
        moveToNextStepId: visaStatusId,
      });
      const visaStatus = response.data.moveToNextStep;
      dispatch(updateVisaStatus({ visaStatus: visaStatus }));
    } catch (error) {
      console.error(error);
      // const message = error.errors[0].message;
    }
  };

const initialState: EmployeeStateType = {
  visaStatus: {
    _id: "",
    employee: "",
    step: "",
    status: "",
    hrFeedback: "",
    workAuthorization: {
      title: "",
      startDate: "",
      endDate: "",
    },
    documents: [],
  },
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    updateVisaStatus: (state, action: PayloadAction<EmployeeStateType>) => {
      state.visaStatus = action.payload.visaStatus;
    },
  },
});

export const { updateVisaStatus } = employeeSlice.actions;

export default employeeSlice.reducer;

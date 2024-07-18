export interface VisaStatusListItemType {
  legalName: string,
  title: string,
  startDate: string,
  endDate: string,
  status: string,
  step: string,
}

export interface AuthStateType {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    email: string;
  } | null;
}

export interface WorkAuthorization {
  title: string;
  startDate: string;
  endDate: string;
}

export interface Documents {
  _id: string;
  title: string;
  timestamp: string;
  filename: string;
  url: string;
  key: string;
}

export interface VisaStatusType {
  _id: string;
  employee: string;
  step: string;
  status: string;
  hrFeedback: string;
  workAuthorization: WorkAuthorization;
  documents: Documents[];
}

export interface VisaStatusResponseType {
  data: {
    getVisaStatusByEmployee: VisaStatusType;
  };
}

export interface EmployeeStateType {
  visaStatus: VisaStatusType;
}

export interface FileUploadResponseType {
  data: {
    createDocument: {
      _id: string;
      title: string;
      timestamp: string;
      filename: string;
      url: string;
      key: string;
    };
  };
}

export interface AddDocumentResponseType {
  data: {
    addDocument: VisaStatusType;
  };
}

export interface ReUploadDocumentResponseType {
  data: {
    reUploadDocument: VisaStatusType;
  };
}

export interface MoveToNextStepResponseType {
  data: {
    moveToNextStep: VisaStatusType;
  };
}

export interface ErrorResponseType {
    message: string;
}
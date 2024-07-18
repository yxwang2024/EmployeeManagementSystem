export interface AuthStateType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserLoginType | null;
}

export interface EmployeeInstanceType {
  id: string;
  onboardingApplication: {
    _id: string;
    status: string;
  };
}

export interface HRInstanceType {
  id: string;
  mailHistory: {
    _id: string;
    email: string;
    registrationToken: string;
    expiration: string;
    name: string;
    status: string;
  }[];
}

export interface UserLoginType {
    id: string;
    username: string;
    email: string;
    role: string;
    instance: EmployeeInstanceType | HRInstanceType;
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

export interface PersonalInfoType {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  profilePicture: string;
  email: string;
  ssn: string;
  dob: string;
  gender: string;
}

export interface OaNameType {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
}
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

export interface HRStateType {
  hr: HRInstanceType;
  allVisaStatuses: [VisaStatusPopulatedType];
}

export interface HRResponseType {
  data: {
    getHR: HRInstanceType;
  };
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


export interface createMailHistoryResponseType {
  data: {
    createMailHistory: {
      _id: string;
      email: string;
      registrationToken: string;
      expiration: string;
      name: string;
      status: string;
    };
  };
}

export interface addMailHistoryResponseType {
  data: {
    addMailHistory: HRInstanceType;
  };
}

export interface PersonalInfoType {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  profilePicture: string;
  email: string;
}

export interface VisaStatusListItemType {
  legalName: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  step: string;
}

export interface Employee {
  id: string;
  email: string;
  username: string;
  profile: Profile
  onboardingApplication: OnboardingApplication
}


export interface Name {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string
}

export interface Identity {

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

export interface IdentityType {
  ssn: string;
  dob: string;
  gender: string;
}

export interface EmploymentType{
  visaTitle: string | undefined,
  startDate: string,
  endDate: string,
}

export interface ReferenceType {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface Address {
  street: string;
  building: string;
  city: string;
  state: string;
  zip: string;
}

export interface ContactInfo {
  cellPhone: string;
  workPhone: string;
}

export interface Employment {
  visaTitle: string;
  startDate: string;
  endDate: string;
}

export interface Reference {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface EmergencyContact {
  id:string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Document {
  _id: string;
  title: string;
  timestamp: string;
  filename: string;
  url: string;
  key: string;
}

export interface Profile {
  id: string;
  email: string;
  name: Name;
  profilePicture: string;
  identity: Identity;
  currentAddress: Address;
  contactInfo: ContactInfo;
  employment: Employment;
  reference: Reference;
  emergencyContacts: [EmergencyContact];
  documents: Documents[];
}

export interface OnboardingApplication {
  id: string;
  email: string;
  name: Name
  profilePicture: string;
  identity: Identity
  currentAddress: Address
  contactInfo: ContactInfo
  employment: Employment
  reference: Reference
  emergencyContacts: [EmergencyContact]
  documents: Documents[]
  status: string;
  hrFeedback: string;
}

export interface VisaStatusPopulatedType {
  _id: string;
  employee: Employee;
  step: string;
  status: string;
  hrFeedback: string;
  workAuthorization: WorkAuthorization;
  documents: Documents[];
}

export interface AllVisaStatusesResponseType {
  data: {
    getVisaStatuses: [VisaStatusPopulatedType];
  };
}

export interface VisaStatusResponse{
  _id: string;
  employee: Employee;
  step: string;
  status: string;
  hrFeedback: string;
  workAuthorization: WorkAuthorization
  documents: [Document]
}

export interface VisaStatusEdge{
  cursor: string;
  node: VisaStatusResponse
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface VisaStatusConnectionType{
  totalCount: number;
  edges: [VisaStatusEdge]
  pageInfo: PageInfo
}

export interface VisaStatusConnectionResponseType {
  data: {
    getVisaStatusConnection: VisaStatusConnectionType;
  };

}

export interface SingleVisaStatusesResponseType {
  data: {
    getVisaStatus: VisaStatusPopulatedType;
  };
}
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from './store';
import { fileUploadRequest } from '../utils/fetch';
import { FileUploadResponseType } from '../utils/type';

interface PersonalInfo {
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

interface Address {
  street: string;
  building: string;
  city: string;
  state: string;
  zip: string;
}

interface ContactInfo {
  cellPhone: string;
  workPhone?: string;
}

interface Document {
  isCitizen: boolean;
  visaTitle: string;
  startDate: string;
  endDate: string;
  optReceipt?: string;
  otherVisa?: string;
  driverLicense?: string;
}

interface Reference {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone?: string;
  email?: string;
}

interface EmergencyContact {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface DocumentData {
  _id: string;
  title: string;
  timestamp: string;
  filename: string;
  url: string;
  key: string;
}

export interface OaInfoState {
  userId: string;
  personalInfo: PersonalInfo;
  address: Address;
  contactInfo: ContactInfo;
  document: Document;
  reference?: Reference | null;
  emergencyContacts: EmergencyContact[];
  currentStep: number;
  status: 'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected' | null;
  documents: DocumentData[];
  isInitialized: boolean;
}

const initialState: OaInfoState = {
  userId: '',
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    profilePicture: '',
    email: '',
    ssn: '',
    dob: '',
    gender: '',
  },
  address: {
    street: '',
    building: '',
    city: '',
    state: '',
    zip: '',
  },
  contactInfo: {
    cellPhone: '',
  },
  document: {
    isCitizen: false,
    visaTitle: '',
    startDate: '',
    endDate: '',
    optReceipt: '',
    otherVisa: '',
    driverLicense: '',
  },
  reference: null,
  emergencyContacts: [],
  currentStep: 1,
  status: JSON.parse(localStorage.getItem('user') || '{}')?.instance?.onboardingApplication?.status || null,
  documents: [],
  isInitialized: false,
};

const token: string = localStorage.getItem('token') || '';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export const initializeFromLocalStorage = createAsyncThunk(
  'oaInfo/initializeFromLocalStorage',
  async (_, { dispatch, getState }) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser?.id;
    const state = getState() as RootState;
    const status = state.oaInfo.status;

    if (status === 'NotSubmitted' || status === 'Rejected') {
      await dispatch(fetchOnboardingData(currentUserId));
    } else {
      const savedData = localStorage.getItem('oaInfo');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.userId === currentUserId) {
          dispatch(setOaInfoData(data));
        } else {
          localStorage.removeItem('oaInfo');
          dispatch(resetOaInfo(currentUserId));
        }
      } else {
        dispatch(resetOaInfo(currentUserId));
      }

      const savedStep = localStorage.getItem('currentStep');
      if (savedStep) {
        dispatch(setCurrentStep(parseInt(savedStep, 10)));
      }
    }
    dispatch(setInitialized(true));
  }
);

export const fetchOnboardingData = createAsyncThunk(
  'oaInfo/fetchOnboardingData',
  async (userId: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      query GetOnboardingApplication($oaId: ID!) {
        getOnboardingApplication(oaId: $oaId) {
          status
          reference {
            relationship
            phone
            middleName
            lastName
            firstName
            email
          }
          profilePicture
          name {
            preferredName
            middleName
            lastName
            firstName
          }
          identity {
            ssn
            gender
            dob
          }
          id
          hrFeedback
          employment {
            visaTitle
            startDate
            endDate
          }
          emergencyContacts {
            relationship
            phone
            middleName
            lastName
            id
            firstName
            email
          }
          email
          documents {
            url
            title
            timestamp
            key
            filename
            _id
          }
          currentAddress {
            zip
            street
            state
            city
            building
          }
          contactInfo {
            workPhone
            cellPhone
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post('', {
        query,
        variables: { oaId: onboardingApplicationId },
      });
      if (response.data.errors) {
        return rejectWithValue(response.data.errors);
      }
      return response.data.data.getOnboardingApplication;
    } catch (error) {
      console.error('Fetch Onboarding Data failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Name
export const updateOAName: any = createAsyncThunk(
  "oaInfo/updateOAName",
  async (personalInfo: Partial<PersonalInfo>, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation UpdateOAName($input: NameInput!) {
        updateOAName(input: $input) {
          id
          email
          name {
            firstName
            lastName
            middleName
            preferredName
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...personalInfo, id: onboardingApplicationId } },
      });
      // console.log("UpdateOAName response:", response);
      return response.data.data.updateOAName;
    } catch (error) {
      console.error("Update OA Name failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Identity
export const updateOAIdentity: any = createAsyncThunk(
  "oaInfo/updateOAIdentity",
  async (personalInfo: Partial<PersonalInfo>, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation UpdateOAIdentity($input: IdentityInput!) {
        updateOAIdentity(input: $input) {
          id
          email
          identity {
            ssn
            dob
            gender
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...personalInfo, id: onboardingApplicationId } },
      });
      return response.data.data.updateOAIdentity;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//以getUrl的值更新
export const updateOAProfilePic: any = createAsyncThunk(
  "oaInfo/updateOAProfilePic",
  async (file: File, { rejectWithValue, dispatch, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    try {
      const document = await dispatch(getUrl('profilePicture', file));
      if (!document) {
        throw new Error("Failed to upload the profile picture");
      }
      const documentId = document._id;
      const profilePictureUrl = document.url;

      const query = `
        mutation updateOAProfilePic($input: ProfilePictureInput!) {
          updateOAProfilePic(input: $input) {
            id
            profilePicture
          }
        }
      `;
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { id: onboardingApplicationId, profilePicture: profilePictureUrl } },
      });

      await dispatch(addOADocument({ id: onboardingApplicationId, documentId }));

      return response.data.data.updateOAProfilePic;
    } catch (error) {
      console.error("Update OA Profile failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

//将profileImage 加到Onboarding Application Documents里面
export const addOADocument: any = createAsyncThunk(
  "oaInfo/addOADocument",
  async (input: { id: string, documentId: string }, { rejectWithValue }) => {
    const query = `
      mutation AddOADocument($input: uploadDocumentInput!) {
        addOADocument(input: $input) {
          id
          documents {
            filename
            url
            title
            timestamp
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input },
      });
      return response.data.data.addOADocument;
    } catch (error) {
      console.error("Add OA Document failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getUrl = (title: string, file: File) =>
  async (dispatch: AppDispatch): Promise<DocumentData | undefined> => {
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
    return response.data.createDocument;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// 更新 Onboarding Application Address
export const updateOACurrentAddress: any = createAsyncThunk(
  "oaInfo/updateOACurrentAddress",
  async (address: Address, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation UpdateOACurrentAddress($input: AddressInput!) {
        updateOACurrentAddress(input: $input) {
          id
          email
          currentAddress {
            street
            building
            city
            state
            zip
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...address, id: onboardingApplicationId } },
      });
      return response.data.data.updateOACurrentAddress;
    } catch (error) {
      console.error("Update OA Address failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Contact Info
export const updateOAContactInfo: any = createAsyncThunk(
  "oaInfo/updateOAContactInfo",
  async (contactInfo: ContactInfo, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation UpdateOAContactInfo($input: ContactInfoInput!) {
        updateOAContactInfo(input: $input) {
          id
          email
          contactInfo {
            cellPhone
            workPhone
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...contactInfo, id: onboardingApplicationId } },
      });
      // console.log("UpdateOAContactInfo response:", response.data);
      return response.data.data.updateOAContactInfo;
    } catch (error) {
      console.error("Update OA Contact Info failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Employment
export const updateOAEmployment: any = createAsyncThunk(
  "oaInfo/updateOAEmployment",
  async (employment: Partial<Document>, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation UpdateOAEmployment($input: EmploymentInput!) {
        updateOAEmployment(input: $input) {
          id
          email
          employment {
            visaTitle
            startDate
            endDate
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...employment, id: onboardingApplicationId } },
      });
      return response.data.data.updateOAEmployment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Reference
export const updateOAReference: any = createAsyncThunk(
  "oaInfo/updateOAReference",
  async (reference: Reference, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation updateOAReference($input: ReferenceInput!) {
        updateOAReference(input: $input) {
          id
          email
          reference {
            firstName
            lastName
            middleName
            phone
            email
            relationship
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...reference, id: onboardingApplicationId } },
      });
      return response.data.data.updateOAReference;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Emergency Contact
export const updateOAEmergencyContact: any = createAsyncThunk(
  'oaInfo/updateOAEmergencyContact',
  async (emergencyContacts: EmergencyContact[], { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation updateOAEmergencyContact($input: EmergencyContactUpdateInput!) {
        updateOAEmergencyContact(input: $input) {
          id
          email
          emergencyContacts {
            firstName
            lastName
            middleName
            relationship
            phone
            email
          }
        }
      }
    `;
    try {
      // console.log('Sending mutation updateOAEmergencyContact with variables:', JSON.stringify(variables, null, 2));
      const response = await axiosInstance.post('', {
        query,
        variables: { input: { id: onboardingApplicationId, emergencyContacts} },
      });
      // console.log('Response from updateOAEmergencyContact:', response.data);
      return response.data.data.updateOAEmergencyContact;
    } catch (error) {
      console.error('Update OA Emergency Contact failed:', error);
      return rejectWithValue(error.message);
    }
  }
);


//更新整个onboarding application 状态
export const updateOAStatus: any = createAsyncThunk(
  'oaInfo/updateOAStatus',
  async (status: 'Pending' | 'Approved' | 'Rejected', { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation Mutation($input: OAStatusInput) {
        updateOAStatus(input: $input) {
          id
          status
        }
      }
    `;
    try {
      const response = await axiosInstance.post('', {
        query,
        variables: { input: { id: onboardingApplicationId, status } },
      });
      return response.data.data.updateOAStatus;
    } catch (error) {
      console.error('Update OA Status failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

const formatDate = (timestamp: string | number | undefined): string => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp.toString(), 10));
  return date.toISOString().split('T')[0]; 
};

const oaInfoSlice = createSlice({
  name: 'oaInfo',
  initialState,
  reducers: {
    setOaInfoData: (state, action: PayloadAction<OaInfoState>) => {
      state.userId = action.payload.userId;
      state.personalInfo = action.payload.personalInfo;
      state.address = action.payload.address;
      state.contactInfo = action.payload.contactInfo;
      state.document = action.payload.document;
      state.reference = action.payload.reference;
      state.emergencyContacts = action.payload.emergencyContacts;
      state.currentStep = action.payload.currentStep;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const status = user?.instance?.onboardingApplication?.status || '';
      state.status = status;
      state.documents = action.payload.documents;
      state.isInitialized = true;
    },
    resetOaInfo: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.personalInfo = initialState.personalInfo;
      state.address = initialState.address;
      state.contactInfo = initialState.contactInfo;
      state.document = initialState.document;
      state.reference = initialState.reference;
      state.emergencyContacts = initialState.emergencyContacts;
      state.currentStep = initialState.currentStep;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const status = user?.instance?.onboardingApplication?.status || '';
      state.status = status;
      state.documents = initialState.documents;
      state.isInitialized = initialState.isInitialized;
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      state.address = { ...state.address, ...action.payload };
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      state.document = { ...state.document, ...action.payload };
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    addDocuments: (state, action: PayloadAction<DocumentData>) => {
      state.documents.push(action.payload);
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updateReference: (state, action: PayloadAction<Reference>) => {
      state.reference = action.payload;
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    updateEmergencyContact: (state, action: PayloadAction<EmergencyContact[]>) => {
      state.emergencyContacts = action.payload;
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      localStorage.setItem('oaInfo', JSON.stringify(state));
      localStorage.setItem('currentStep', action.payload.toString());
    },
    setStatus: (state, action: PayloadAction<'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected'>) => {
      state.status = action.payload;
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeFromLocalStorage.fulfilled, (state) => {
        state.isInitialized = true;
      })
      .addCase(fetchOnboardingData.fulfilled, (state, action) => {
        const data = action.payload;
        if (data) {
          // console.log('Fetched onboarding data:', data);
          state.personalInfo.firstName = data.name.firstName || initialState.personalInfo.firstName;
          state.personalInfo.lastName = data.name.lastName || initialState.personalInfo.lastName;
          state.personalInfo.middleName = data.name.middleName || initialState.personalInfo.middleName;
          state.personalInfo.preferredName = data.name.preferredName || initialState.personalInfo.preferredName;
          if(data.profilePicture !== "placeholder"){
            state.personalInfo.profilePicture = data.profilePicture;
          } else{
            state.personalInfo.profilePicture = initialState.personalInfo.profilePicture;
          }
          state.personalInfo.ssn = data.identity.ssn || initialState.personalInfo.ssn;
          state.personalInfo.dob = formatDate(data.identity.dob) || initialState.personalInfo.dob;
          state.personalInfo.gender = data.identity.gender || initialState.personalInfo.gender;
          state.address = data.currentAddress || initialState.address;
          state.contactInfo = data.contactInfo || initialState.contactInfo;
          if (data.employment.visaTitle === 'isCitizen') {
            state.document.isCitizen = true;
          } else if (['H1-B', 'L2', 'F1(CPT/OPT)', 'H4'].includes(data.employment.visaTitle)) {
            state.document.visaTitle = data.employment.visaTitle;
            state.document.isCitizen = false;
          } else {
            state.document.visaTitle = 'Other';
            state.document.otherVisa = data.employment.visaTitle;
            state.document.isCitizen = false;
          }
          state.document.startDate = formatDate(data.employment.startDate) || initialState.document.startDate;
          state.document.endDate = formatDate(data.employment.endDate) || initialState.document.endDate;

          state.reference = data.reference || initialState.reference;
          state.emergencyContacts = data.emergencyContacts || initialState.emergencyContacts;
          state.documents = data.documents || initialState.documents;
          state.isInitialized = true;
        }
      })
      .addCase(fetchOnboardingData.rejected, (state, action) => {
        console.error('fetchOnboardingData rejected:', action.payload);
      });
  },
});

export const {
  setOaInfoData,
  resetOaInfo,
  updatePersonalInfo,
  updateAddress,
  updateContactInfo,
  updateDocument,
  addDocuments,
  updateReference,
  updateEmergencyContact,
  setCurrentStep,
  setStatus,
  setInitialized,
} = oaInfoSlice.actions;

export default oaInfoSlice.reducer;
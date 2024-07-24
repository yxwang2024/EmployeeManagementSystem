import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from './store';
import { FileUploadResponseType } from '../utils/type';
import { request, fileUploadRequest } from "../utils/fetch";
// import { fileUploadRequest } from "../utils/fetch";

export interface PersonalInfo {
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

export interface Address {
  street: string;
  building: string;
  city: string;
  state: string;
  zip: string;
}

export interface ContactInfo {
  cellPhone: string;
  workPhone?: string;
}

export interface Document {
  isCitizen: boolean;
  visaTitle: string;
  startDate: string;
  endDate: string;
  optReceipt?: string;
  otherVisa?: string;
  driverLicense?: string;
}

export interface Reference {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone?: string;
  email?: string;
}

export interface EmergencyContact {
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
    workPhone: '',
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

// const token: string = localStorage.getItem('token') || '';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000/graphql',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   },
// });

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const initializeFromLocalStorage = createAsyncThunk(
  'oaInfo/initializeFromLocalStorage',
  async (_, { dispatch }) => {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   console.error('Token not found');
    //   return;
    // }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser?.id;

    // await new Promise(resolve => setTimeout(resolve, 1000));

    const savedData = localStorage.getItem(`oaInfo-${currentUserId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      // console.log("Data parsed from localStorage:", data);
      dispatch(setOaInfoData({ ...data, userId: currentUserId }));
    } else {
      await dispatch(fetchOnboardingData(currentUserId)).then((response) => {
        if (response.type === 'oaInfo/fetchOnboardingData/fulfilled') {
          // console.log("Data fetched from server:", response.payload);
          dispatch(setOaInfoData({ ...response.payload, userId: currentUserId }));
        } else {
          console.error('Failed to fetch onboarding data:', response);
        }
      });
    }
    dispatch(setInitialized(true));
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      dispatch(setCurrentStep(parseInt(savedStep, 10)));
    }
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
      // const response = await request(query, { oaId: onboardingApplicationId });
      if (response.data.errors) {
        return rejectWithValue(response.data.errors);
      }
      // return response.data.getOnboardingApplication;
      const onboardingData = response.data.data.getOnboardingApplication;
      onboardingData.userId = userId;
      // console.log("Onboarding data:", onboardingData);
      // return onboardingData;
      const emergencyContacts = (onboardingData.emergencyContacts || []).map((contact: any) => {
        const { id, ...rest } = contact;
        return rest;
      });
      const optReceiptDocument = onboardingData.documents.find(doc => doc.filename === 'optReceipt');
      const driverLicenseDocument = onboardingData.documents.find(doc => doc.fileBame === 'driverLicense');
      // console.log("!!!", onboardingData.documents);
      // console.log("optReceiptDocument URL: ", optReceiptDocument ? optReceiptDocument : 'not found');
      // console.log("driverLicenseDocument URL: ", driverLicenseDocument ? driverLicenseDocument : 'not found');

      const formattedData = {
        userId: userId,
        personalInfo: {
          firstName: onboardingData.name.firstName || '',
          middleName: onboardingData.name.middleName || '',
          lastName: onboardingData.name.lastName || '',
          preferredName: onboardingData.name.preferredName || '',
          profilePicture: onboardingData.profilePicture !== 'placeholder' ? onboardingData.profilePicture : '',
          email: onboardingData.email || '',
          ssn: onboardingData.identity.ssn || '',
          dob: formatDate(onboardingData.identity.dob) || '',
          gender: onboardingData.identity.gender || ''
        },
        address: {
          street: onboardingData.currentAddress.street || '',
          building: onboardingData.currentAddress.building || '',
          city: onboardingData.currentAddress.city || '',
          state: onboardingData.currentAddress.state || '',
          zip: onboardingData.currentAddress.zip || ''
        },
        contactInfo: {
          cellPhone: onboardingData.contactInfo.cellPhone || '',
          workPhone: onboardingData.contactInfo.workPhone || ''
        },
        document: {
          isCitizen: onboardingData.employment.visaTitle === 'isCitizen',
          visaTitle: ['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', ''].includes(onboardingData.employment.visaTitle) ? onboardingData.employment.visaTitle : 'Other',
          startDate: formatDate(onboardingData.employment.startDate) || '',
          endDate: formatDate(onboardingData.employment.endDate) || '',
          optReceipt: optReceiptDocument ? optReceiptDocument.url : '',
          otherVisa: ['H1-B', 'L2', 'F1(CPT/OPT)', 'H4'].includes(onboardingData.employment.visaTitle) ? '' : onboardingData.employment.visaTitle,
          driverLicense: driverLicenseDocument ? driverLicenseDocument.url : '',
        },
        reference: onboardingData.reference || null,
        emergencyContacts: emergencyContacts || [],
        currentStep: 1,
        status: onboardingData.status || 'NotSubmitted',
        documents: onboardingData.documents || [],
        isInitialized: true,
        hrFeedback: onboardingData.hrFeedback || ""
      };

      // console.log("Formatted data:", formattedData);
      return formattedData;
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
      const mimeType = file.type;
      const profilePictureFilename = `profilePicture.${mimeType.split('/')[1]}`;
      const document = await dispatch(getUrl(profilePictureFilename, file));
      if (!document) {
        throw new Error("Failed to upload the profile picture");
      }
      // console.log("onInfo: ", document)
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
    // console.log("oaInfo: ", response.data.createDocument)
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
      // console.log("emergencyContacts: ", emergencyContacts)
      // const response = await axiosInstance.post('', {
      //   query,
      //   variables: { input: { id: onboardingApplicationId, emergencyContacts} },
      // });
      const response = await request(query, {
        input:{ id: onboardingApplicationId, emergencyContacts: emergencyContacts},
      })
      // console.log('Response from updateOAEmergencyContact:', response.data);
      return response.data.updateOAEmergencyContact;
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

//删除oa Document
export const deleteOADocument: any = createAsyncThunk(
  'oaInfo/deleteOADocument',
  async ({ id, documentId }: { id: string, documentId: string }, { rejectWithValue }) => {
    const query = `
      mutation DeleteOADocument($input: uploadDocumentInput!) {
        deleteOADocument(input: $input) {
          id
          documents {
            url
            title
            timestamp
            key
            filename
          }
        }
      }
    `;
    try {
      const response = await axiosInstance.post('', {
        query,
        variables: { input: { id, documentId } },
      });
      return response.data.data.deleteOADocument;
    } catch (error) {
      console.error('Delete OA Document failed:', error);
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
      // console.log("Payload received in setOaInfoData:", action.payload);
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
      
      // 在保存到 localStorage 之前进行日志记录
      const dataToSave = {
        userId: state.userId,
        personalInfo: state.personalInfo,
        address: state.address,
        contactInfo: state.contactInfo,
        document: state.document,
        reference: state.reference,
        emergencyContacts: state.emergencyContacts,
        currentStep: state.currentStep,
        status: state.status,
        documents: state.documents,
        isInitialized: state.isInitialized
      };
      // console.log("Data to be saved to localStorage:", dataToSave);
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(dataToSave));
      // console.log("State after setting data:", JSON.stringify(state));
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      state.address = { ...state.address, ...action.payload };
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      state.document = { ...state.document, ...action.payload };
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    addDocuments: (state, action: PayloadAction<DocumentData>) => {
      state.documents.push(action.payload);
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    updateReference: (state, action: PayloadAction<Reference>) => {
      state.reference = action.payload;
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    updateEmergencyContact: (state, action: PayloadAction<EmergencyContact[]>) => {
      state.emergencyContacts = action.payload;
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
      localStorage.setItem('currentStep', action.payload.toString());
    },
    setStatus: (state, action: PayloadAction<'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected'>) => {
      state.status = action.payload;
      localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
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
        // if (data) {
        //   state.userId = data.userId || state.userId;
        //   state.personalInfo.firstName = data.name.firstName || initialState.personalInfo.firstName;
        //   state.personalInfo.lastName = data.name.lastName || initialState.personalInfo.lastName;
        //   state.personalInfo.middleName = data.name.middleName || initialState.personalInfo.middleName;
        //   state.personalInfo.preferredName = data.name.preferredName || initialState.personalInfo.preferredName;
        //   if(data.profilePicture !== "placeholder"){
        //     state.personalInfo.profilePicture = data.profilePicture;
        //   } else{
        //     state.personalInfo.profilePicture = initialState.personalInfo.profilePicture;
        //   }
        //   state.personalInfo.ssn = data.identity.ssn || initialState.personalInfo.ssn;
        //   state.personalInfo.dob = formatDate(data.identity.dob) || initialState.personalInfo.dob;
        //   state.personalInfo.gender = data.identity.gender || initialState.personalInfo.gender;
        //   state.address = data.currentAddress || initialState.address;
        //   state.contactInfo = data.contactInfo || initialState.contactInfo;
        //   if (data.employment.visaTitle === 'isCitizen') {
        //     state.document.isCitizen = true;
        //   } else if (['H1-B', 'L2', 'F1(CPT/OPT)', 'H4'].includes(data.employment.visaTitle)) {
        //     state.document.visaTitle = data.employment.visaTitle;
        //     state.document.isCitizen = false;
        //   } else {
        //     state.document.visaTitle = 'Other';
        //     state.document.otherVisa = data.employment.visaTitle;
        //     state.document.isCitizen = false;
        //   }
        //   state.document.startDate = formatDate(data.employment.startDate) || initialState.document.startDate;
        //   state.document.endDate = formatDate(data.employment.endDate) || initialState.document.endDate;

        //   state.reference = data.reference || initialState.reference;
        //   state.emergencyContacts = data.emergencyContacts || initialState.emergencyContacts;
        //   state.documents = data.documents || initialState.documents;
        //   state.status = data.status || initialState.status;
        //   state.isInitialized = true;
        //   // console.log("state: ", JSON.stringify(state) )
        //   localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
        // }
        if (data) {
          // console.log("State before setting data:", JSON.stringify(state));
          state.userId = data.userId || state.userId;
          state.personalInfo = data.personalInfo;
          state.address = data.address;
          state.contactInfo = data.contactInfo;
          state.document = data.document;
          state.reference = data.reference;
          state.emergencyContacts = data.emergencyContacts;
          state.documents = data.documents;
          state.status = data.status;
          state.isInitialized = true;
          // console.log("State after setting data:", JSON.stringify(state));
          localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
        }
      })
      .addCase(fetchOnboardingData.rejected, (state, action) => {
        console.error('fetchOnboardingData rejected:', action.payload);
      })
      .addCase(deleteOADocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc._id !== action.meta.arg.documentId);
        localStorage.setItem(`oaInfo-${state.userId}`, JSON.stringify(state));
      });
  },
});

export const {
  setOaInfoData,
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
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  profilePicture: string; // Will store base64 string
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

export interface OaInfoState {
  personalInfo: PersonalInfo;
  address: Address;
  contactInfo: ContactInfo;
  document: Document;
  reference?: Reference | null;
  emergencyContacts: EmergencyContact[];
  currentStep: number;
  status: 'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected' | null;
  isInitialized: boolean;
}

const initialState: OaInfoState = {
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
  status: "NotSubmitted",
  isInitialized: false,
};

export const initializeFromLocalStorage = createAsyncThunk(
  'oaInfo/initializeFromLocalStorage',
  async (_, { dispatch }) => {
    const savedData = localStorage.getItem('oaInfo');
    if (savedData) {
      const data = JSON.parse(savedData);
      dispatch(setOaInfoData(data));
    }
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      dispatch(setCurrentStep(parseInt(savedStep, 10)));
    }
    dispatch(setInitialized(true));
  }
);

const oaInfoSlice = createSlice({
  name: 'oaInfo',
  initialState,
  reducers: {
    setOaInfoData: (state, action: PayloadAction<OaInfoState>) => {
      state.personalInfo = action.payload.personalInfo;
      state.address = action.payload.address;
      state.contactInfo = action.payload.contactInfo;
      state.document = action.payload.document;
      state.reference = action.payload.reference;
      state.emergencyContacts = action.payload.emergencyContacts;
      state.currentStep = action.payload.currentStep;
      state.status = action.payload.status;
      state.isInitialized = true;
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
    updateReference: (state, action: PayloadAction<Reference>) => {
      state.reference = action.payload;
      localStorage.setItem('oaInfo', JSON.stringify(state));
    },
    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.emergencyContacts.push(action.payload);
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
    builder.addCase(initializeFromLocalStorage.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export const {
  setOaInfoData,
  updatePersonalInfo,
  updateAddress,
  updateContactInfo,
  updateDocument,
  updateReference,
  addEmergencyContact,
  updateEmergencyContact,
  setCurrentStep,
  setStatus,
  setInitialized,
} = oaInfoSlice.actions;

export default oaInfoSlice.reducer;
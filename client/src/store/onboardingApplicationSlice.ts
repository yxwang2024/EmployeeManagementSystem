import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface OnboardingApplicationState {
  personalInfo: PersonalInfo;
  address: Address;
  contactInfo: ContactInfo;
  document: Document;
  reference?: Reference;
  emergencyContacts: EmergencyContact[];
  currentStep: number;
}

const initialState: OnboardingApplicationState = {
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
    visaTitle: '',
    startDate: '',
    endDate: '',
  },
  emergencyContacts: [],
  currentStep: 1,
};

const onboardingApplicationSlice = createSlice({
  name: 'onboardingApplication',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personalInfo = action.payload;
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      state.address = action.payload;
    },
    updateContactInfo: (state, action: PayloadAction<ContactInfo>) => {
      state.contactInfo = action.payload;
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      state.document = action.payload;
    },
    updateReference: (state, action: PayloadAction<Reference>) => {
      state.reference = action.payload;
    },
    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.emergencyContacts.push(action.payload);
    },
    updateEmergencyContact: (state, action: PayloadAction<EmergencyContact[]>) => {
      state.emergencyContacts = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
  },
});

export const {
  updatePersonalInfo,
  updateAddress,
  updateContactInfo,
  updateDocument,
  updateReference,
  addEmergencyContact,
  updateEmergencyContact,
  setCurrentStep,
} = onboardingApplicationSlice.actions;

export default onboardingApplicationSlice.reducer;
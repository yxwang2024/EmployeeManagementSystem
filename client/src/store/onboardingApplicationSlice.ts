import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Name {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
}

interface Address {
  street: string;
  building: string;
  city: string;
  state: string;
  zip: string;
}

interface Identity {
  ssn: string;
  dob: string;
  gender: string;
  visaTitle?: string;
  startDate?: string;
  endDate?: string;
  optReceipt?: string;
  otherVisaTitle?: string;
}

interface ContactInfo {
  cellPhone: string;
  workPhone?: string;
}

interface Reference {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  email?: string;
  relationship: string;
}

interface EmergencyContact {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  email?: string;
  relationship: string;
}

interface OnboardingApplicationState {
  name: Name;
  profilePicture: string;
  email: string;
  identity: Identity;
  currentAddress: Address;
  contactInfo: ContactInfo;
  reference?: Reference;
  emergencyContacts: EmergencyContact[];
  documents: string[];
  status: string;
  hrFeedback?: string;
}

const initialState: OnboardingApplicationState = {
  name: {
    firstName: '',
    lastName: '',
  },
  profilePicture: 'placeholder',
  email: '',
  identity: {
    ssn: '',
    dob: '',
    gender: '',
  },
  currentAddress: {
    street: '',
    building: '',
    city: '',
    state: '',
    zip: '',
  },
  contactInfo: {
    cellPhone: '',
  },
  emergencyContacts: [],
  documents: [],
  status: 'NotSubmitted',
};

const onboardingApplicationSlice = createSlice({
  name: 'onboardingApplication',
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<Name>) => {
      state.name = action.payload;
    },
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateIdentity: (state, action: PayloadAction<Identity>) => {
      state.identity = action.payload;
    },
    updateCurrentAddress: (state, action: PayloadAction<Address>) => {
      state.currentAddress = action.payload;
    },
    updateContactInfo: (state, action: PayloadAction<ContactInfo>) => {
      state.contactInfo = action.payload;
    },
    updateReference: (state, action: PayloadAction<Reference>) => {
      state.reference = action.payload;
    },
    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.emergencyContacts.push(action.payload);
    },
    removeEmergencyContact: (state, action: PayloadAction<number>) => {
      state.emergencyContacts.splice(action.payload, 1);
    },
    addDocument: (state, action: PayloadAction<string>) => {
      state.documents.push(action.payload);
    },
    removeDocument: (state, action: PayloadAction<number>) => {
      state.documents.splice(action.payload, 1);
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    updateHrFeedback: (state, action: PayloadAction<string>) => {
      state.hrFeedback = action.payload;
    },
  },
});

export const {
  updateName,
  updateProfilePicture,
  updateEmail,
  updateIdentity,
  updateCurrentAddress,
  updateContactInfo,
  updateReference,
  addEmergencyContact,
  removeEmergencyContact,
  addDocument,
  removeDocument,
  updateStatus,
  updateHrFeedback,
} = onboardingApplicationSlice.actions;

export default onboardingApplicationSlice.reducer;
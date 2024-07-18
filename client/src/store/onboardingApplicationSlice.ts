import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 定义类型
interface PersonalInfoType {
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

interface AddressType {
  street: string;
  building: string;
  city: string;
  state: string;
  zip: string;
}

interface ContactInfoType {
  cellPhone: string;
  workPhone?: string;
}

interface DocumentType {
  visaTitle: string;
  startDate: string;
  endDate: string;
  optReceipt?: string;
  otherVisa?: string;
  driverLicense?: string;
}

interface ReferenceType {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone?: string;
  email?: string;
}

interface EmergencyContactType {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone?: string;
  email?: string;
}

interface OnboardingApplicationStateType {
  personalInfo: PersonalInfoType;
  address: AddressType;
  contactInfo: ContactInfoType;
  document: DocumentType;
  reference?: ReferenceType;
  emergencyContacts: EmergencyContactType[];
  currentStep: number;
  status: string | null;
  employeeId: string | null;
  loading: boolean;
}

const initialState: OnboardingApplicationStateType = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    preferredName: "",
    profilePicture: "",
    email: "",
    ssn: "",
    dob: "",
    gender: "",
  },
  address: {
    street: "",
    building: "",
    city: "",
    state: "",
    zip: "",
  },
  contactInfo: {
    cellPhone: "",
  },
  document: {
    visaTitle: "",
    startDate: "",
    endDate: "",
    optReceipt: "",
    otherVisa: "",
    driverLicense: "",
  },
  emergencyContacts: [],
  currentStep: 1,
  status: null,
  employeeId: null,
  loading: false,
};

const token: string = localStorage.getItem('token') || '';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// 获取 OnboardingApplication 数据
export const fetchOnboardingApplication = createAsyncThunk(
  "onboardingApplication/fetchOnboardingApplication",
  async (onboardingApplicationId: string, { rejectWithValue }) => {
    const query = `
      query GetOnboardingApplication($oaId: ID!) {
        getOnboardingApplication(oaId: $oaId) {
          id
          email
          name {
            firstName
            middleName
            lastName
            preferredName
          }
          identity {
            ssn
            dob
            gender
          }
          currentAddress {
            street
            city
            state
            zip
          }
          contactInfo {
            cellPhone
            workPhone
          }
          employment {
            visaTitle
            startDate
            endDate
          }
          status
        }
      }
    `;
    try {
      const response = await axiosInstance.post("http://localhost:3000/graphql", {
        query,
        variables: { oaId: onboardingApplicationId },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const onboardingApplication = response.data.data.getOnboardingApplication;
      return onboardingApplication;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Name
export const updateOAName = createAsyncThunk(
  "onboardingApplication/updateOAName",
  async (personalInfo: Partial<PersonalInfoType>, { rejectWithValue, getState }) => {
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
      return response.data.data.updateOAName;
    } catch (error) {
      console.error("Update OA Name failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Identity
export const updateOAIdentity = createAsyncThunk(
  "onboardingApplication/updateOAIdentity",
  async (personalInfo: Partial<PersonalInfoType>, { rejectWithValue, getState }) => {
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
      console.log("Sending UpdateOAIdentity mutation with input:", { ...personalInfo, id: onboardingApplicationId });
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...personalInfo, id: onboardingApplicationId } },
      });
      console.log("UpdateOAIdentity response:", response.data);
      return response.data.data.updateOAIdentity;
    } catch (error) {
      console.error("Update OA Identity failed:", error);
      return rejectWithValue(error.message);
    }
  }
);


// 更新 Onboarding Application Address
export const updateOACurrentAddress = createAsyncThunk(
  "onboardingApplication/updateOACurrentAddress",
  async (address: Partial<AddressType>, { rejectWithValue }) => {
    const query = `
      mutation UpdateOACurrentAddress($input: AddressInput!) {
        updateOACurrentAddress(input: $input) {
          street
          city
          state
          zip
        }
      }
    `;
    try {
      const response = await axios.post("http://localhost:3000/graphql", {
        query,
        variables: { input: address },
      });
      return response.data.data.updateOACurrentAddress;
    } catch (error) {
      console.error("Update OA Address failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

const onboardingApplicationSlice = createSlice({
  name: "onboardingApplication",
  initialState,
  reducers: {
    updatePersonalInfo: (
      state,
      action: PayloadAction<{ personalInfo: Partial<PersonalInfoType> }>
    ) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload.personalInfo };
    },
    updateAddress: (state, action: PayloadAction<{ address: AddressType }>) => {
      state.address = action.payload.address;
    },
    updateContactInfo: (state, action: PayloadAction<{ contactInfo: ContactInfoType }>) => {
      state.contactInfo = action.payload.contactInfo;
    },
    updateDocument: (state, action: PayloadAction<{ document: DocumentType }>) => {
      state.document = action.payload.document;
    },
    updateReference: (state, action: PayloadAction<{ reference: ReferenceType }>) => {
      state.reference = action.payload.reference;
    },
    addEmergencyContact: (
      state,
      action: PayloadAction<{ emergencyContact: EmergencyContactType }>
    ) => {
      state.emergencyContacts.push(action.payload.emergencyContact);
    },
    updateEmergencyContact: (
      state,
      action: PayloadAction<{ emergencyContacts: EmergencyContactType[] }>
    ) => {
      state.emergencyContacts = action.payload.emergencyContacts;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateOnboardingApplication: (
      state,
      action: PayloadAction<{ onboardingApplication: OnboardingApplicationStateType }>
    ) => {
      return action.payload.onboardingApplication;
    },
    updateStatus: (state, action: PayloadAction<{ status: string }>) => {
      state.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboardingApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOnboardingApplication.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.personalInfo = {
          ...state.personalInfo,
          firstName: data.name.firstName,
          middleName: data.name.middleName,
          lastName: data.name.lastName,
          preferredName: data.name.preferredName,
          email: data.email,
          ssn: data.identity.ssn,
          dob: data.identity.dob,
          gender: data.identity.gender,
        };
        state.address = { ...state.address, ...action.payload.currentAddress };
        state.contactInfo = { ...state.contactInfo, ...action.payload.contactInfo };
        state.document = { ...state.document, ...action.payload.employment };
        state.status = action.payload.status;
      })
      .addCase(fetchOnboardingApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOAName.fulfilled, (state, action) => {
        state.personalInfo = { ...state.personalInfo, ...action.payload.name };
      })
      .addCase(updateOAIdentity.fulfilled, (state, action) => {
        state.personalInfo = { ...state.personalInfo, ...action.payload.identity };
      });
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
  updateOnboardingApplication,
  updateStatus,
} = onboardingApplicationSlice.actions;

export default onboardingApplicationSlice.reducer;
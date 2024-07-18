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
};

const token: string = localStorage.getItem('token') || '';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export const fetchUser = createAsyncThunk(
  "onboardingApplication/fetchUser",
  async (userId: string, { rejectWithValue }) => {
    const query = `
      query GetUser($id: ID!) {
        getUser(id: $id) {
          instance {
            ... on Employee {
              id
            }
          }
        }
      }
    `;
    try {
      const response = await axios.post('http://localhost:3000/graphql', {
        query,
        variables: { id: userId },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const employeeId = response.data.data.getUser.instance.id;
      return employeeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// 获取员工数据
export const fetchEmployee = createAsyncThunk(
  "onboardingApplication/fetchEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    const query = `
      query GetEmployee($employeeId: ID!) {
        getEmployee(employeeId: $employeeId) {
          id
          onboardingApplication {
            id
          }
        }
      }
    `;
    try {
      const response = await axios.post("http://localhost:3000/graphql", {
        query,
        variables: { employeeId },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const employee = response.data.data.getEmployee;
      if (!employee) {
        throw new Error(`Employee with id ${employeeId} not found`);
      }
      const onboardingApplicationId = employee.onboardingApplication.id;
      return onboardingApplicationId;
    } catch (error) {
      console.error("Fetch employee failed:", error);
      return rejectWithValue(error.message);
    }
  }
);


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
            lastName
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
      const response = await axios.post("http://localhost:3000/graphql", {
        query,
        variables: { oaId: onboardingApplicationId },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const onboardingApplication = response.data.data.getOnboardingApplication;
      console.log("Fetched onboarding application:", onboardingApplication);
      return onboardingApplication;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Name
export const updateOAName = createAsyncThunk(
  "onboardingApplication/updateOAName",
  async (personalInfo: Partial<PersonalInfoType>, { rejectWithValue }) => {
    const query = `
      mutation UpdateOAName($input: NameInput!) {
        updateOAName(input: $input) {
          firstName
          lastName
        }
      }
    `;
    try {
      const response = await axios.post("http://localhost:3000/graphql", {
        query,
        variables: { input: personalInfo },
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
  async (identity: Partial<PersonalInfoType>, { rejectWithValue }) => {
    const query = `
      mutation UpdateOAIdentity($input: IdentityInput!) {
        updateOAIdentity(input: $input) {
          ssn
          dob
          gender
        }
      }
    `;
    try {
      const response = await axios.post("http://localhost:3000/graphql", {
        query,
        variables: { input: identity },
      });
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
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeId = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

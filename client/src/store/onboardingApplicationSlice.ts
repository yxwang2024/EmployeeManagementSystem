import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "./store";
import { fileUploadRequest } from "../utils/fetch";
import { FileUploadResponseType } from "../utils/type";
import { PersonalInfoType, OaNameType } from "../utils/type";

// 定义类型

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

interface EmploymentType {
  visaTitle: string;
  startDate: string;
  endDate: string;
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
  employment: EmploymentType;
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
    workPhone: "",
  },
  employment: {
    visaTitle: "",
    startDate: "",
    endDate: "",
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
          profilePicture
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
export const updateOAName: any = createAsyncThunk(
  "onboardingApplication/updateOAName",
  async (personalInfo: Partial<OaNameType>, { rejectWithValue, getState }) => {
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
      console.log("UpdateOAName response:", response);
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

//以getProfilePicUrl的值更新
export const updateOAProfilePic: any = createAsyncThunk(
  "onboardingApplication/updateOAProfilePic",
  async (profilePictureUrl: string, { rejectWithValue, getState }) => {
    console.log("!url!: ", profilePictureUrl);
    const state = getState() as RootState;
    const onboardingApplicationId = state.auth.user?.instance?.onboardingApplication?.id;

    const query = `
      mutation updateOAProfilePic($input: ProfilePictureInput!) {
        updateOAProfilePic(input: $input) {
          id
          profilePicture
        }
      }
    `;
    try {
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { id: onboardingApplicationId, profilePicture: profilePictureUrl } },
      });
      return response.data.data.updateOAProfilePic;
    } catch (error) {
      console.error("Update OA Profile failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

//图片传到 AWS S3返回一个string
export const getProfilePicUrl = 
  (title: string, file: File) =>
  async (dispatch: AppDispatch) => {
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
    // console.log("title: ", title);
    // console.log("!!!!!!!!!!!", file);
    const response: FileUploadResponseType = await fileUploadRequest(
      query,
      title,
      file
    ).then(response => {console.log("!!!!!!!!!!!!!!!!", response); return response}) 
    // console.log("!!!!!!!!!!!", response);
    dispatch(
      updateOAProfilePic( response.data.createDocument.url )
    );
  } catch (error) {
    console.error(error);
  }
};


// 更新 Onboarding Application Address
export const updateOACurrentAddress = createAsyncThunk(
  "onboardingApplication/updateOACurrentAddress",
  async (address: Partial<AddressType>, { rejectWithValue, getState }) => {
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
export const updateOAContactInfo = createAsyncThunk(
  "onboardingApplication/updateOAContactInfo",
  async (contactInfo: Partial<ContactInfoType>, { rejectWithValue, getState }) => {
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
      console.log("Sending UpdateOAContactInfo mutation with input:", { ...contactInfo, id: onboardingApplicationId });
      const response = await axiosInstance.post("", {
        query,
        variables: { input: { ...contactInfo, id: onboardingApplicationId } },
      });
      console.log("UpdateOAContactInfo response:", response.data);
      return response.data.data.updateOAContactInfo;
    } catch (error) {
      console.error("Update OA Contact Info failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// 更新 Onboarding Application Employment
export const updateOAEmployment = createAsyncThunk(
  "onboardingApplication/updateOAEmployment",
  async (employment: Partial<EmploymentType>, { rejectWithValue, getState }) => {
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
    updateEmployment: (state, action: PayloadAction<{ employment: EmploymentType }>) => {
      state.employment =  action.payload.employment ;
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
      localStorage.setItem('currentStep', action.payload.toString());
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
    updateOAProfilePic: (state, action: PayloadAction<{ profilePicture: string }>) => {
      state.personalInfo.profilePicture = action.payload.profilePicture;
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
          profilePicture: data.profilePicture || '',
        };
        state.address = { ...state.address, ...action.payload.currentAddress };
        state.contactInfo = { ...state.contactInfo, ...action.payload.contactInfo };
        state.employment = { ...state.employment, ...action.payload.employment };
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
      })
      .addCase(updateOACurrentAddress.fulfilled, (state, action) => {
        state.address = { ...state.address, ...action.payload.currentAddress };
      })
      .addCase(updateOAContactInfo.fulfilled, (state, action) => {
        state.contactInfo = { ...state.contactInfo, ...action.payload.contactInfo };
      })
      .addCase(updateOAProfilePic.fulfilled, (state, action) => {
        state.personalInfo = action.payload.profilePicture ;
      })
      .addCase(updateOAEmployment.fulfilled, (state, action) => {
        state.employment = { ...state.employment, ...action.payload.employment };
      });
  },
});

export const {
  updatePersonalInfo,
  updateAddress,
  updateEmployment,
  updateContactInfo,
  updateReference,
  addEmergencyContact,
  updateEmergencyContact,
  setCurrentStep,
  updateOnboardingApplication,
  updateStatus,
} = onboardingApplicationSlice.actions;

export default onboardingApplicationSlice.reducer;
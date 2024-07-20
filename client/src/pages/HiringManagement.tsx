import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchHR, sendEmail } from '../store/slices/hr';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../store/hooks';
import { delayFunctionCall } from '../utils/utilities';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Input,
  Button,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSearchParams } from "react-router-dom";

const BASE_URL = "http://localhost:5173/signup?registrationToken=";

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email'),
  name: Yup.string().required('Name is required').min(3, 'Name is Too Short!').max(30, 'Name is Too Long!'),
});

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
});


const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#d1eaff',
    },
  }),
);

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}



const HiringManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr.hr);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const [value, setValue] = React.useState(0);

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.has('tab')) {
      setValue(parseInt(searchParams.get('tab') || '0'));
    }
  }, [searchParams]);


  useEffect(() => {
    console.log('user:', user);
    if (user && user.role !== 'HR') {
      navigate('/login');
    } else if (user) {
      const HRId = user.instance.id;
      showLoading(true);
      dispatch(fetchHR(HRId)).then(() => {
        delayFunctionCall(showLoading, 300, false);
      }).catch((error) => {
        console.log(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        navigate('/login');
      });
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // ?tab=0 or ?tab=1&page=1 or ?tab=2&page=1
    if (newValue === 0) {
      setSearchParams({ tab: newValue.toString() });
    } else {
      setSearchParams({ tab: newValue.toString(), page: '1' });
    }
  };  

  const handleRegistrationSubmit = async (values: { email: string; name: string }) => {
    // validate email and name
    try {
      await validationSchema.validate(values);
      const { email, name } = values;
      console.log(email, name);
      showLoading(true);
      dispatch(sendEmail(email, name)).then(() => {
        delayFunctionCall(showLoading, 300, false);
        showMessage(`email sent to ${email}`, "success", 2000);
      }).catch((error) => {
        console.log(error);
        showMessage(error, "failed", 2000);
        showLoading(false);
      });
    } catch (error: any) {
      showMessage(error.message, "failed", 2000);
      return;
    }
  };

  return (
    <div className='w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto'>
      <div className="w-11/12 border p-2 md:p-8 rounded-lg bg-white shadow-lg">
      <Box sx={{ width: '100%' }}>
      <Box sx={{ bgcolor: '#fff' }}>
        <AntTabs value={value} onChange={handleTabChange} aria-label="hiring-management">
          <AntTab label="Registration" />
          <AntTab label="Mail History" />
          <AntTab label="Onboarding Review" />
        </AntTabs>
        <Box sx={{ p: 3 }} />
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col space-y-4">
          {/* generate registration token with email and name with send email button */}
          <div className="flex flex-col space-y-4">
            <Typography variant="h6">Generate Registration Token</Typography>
            <Formik
              initialValues={{
                email: '',
                name: '',
              }}
              onSubmit={async (values) => {
                handleRegistrationSubmit(values);
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  <Input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <Input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <div className="flex flex-row w-full justify-center">
                    <Button type="submit" variant="contained" className='w-1/2 mx-auto'>
                      Send Email
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div> 
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <h1 className="text-left text-3xl mb-2 font-bold text-gray-700 border-b-2 pb-4">
          Mail History
        </h1>
        <div className="flex space-x-4 justify-start">
          <div className="flex flex-col items-center space-y-4 w-full">
            {hr?.mailHistory.map((history, index) => (
              <div key={index} className="flex items-center flex-row justify-between space-x-2 w-full border-b-2 pb-2">
                <div className="md:min-w-36 md:max-w-56 min-w-20 max-w-20">
                  <Typography variant="subtitle1" className='truncate'>{history.name}</Typography>
                </div>
                <div className="md:min-w-36 md:max-w-96 min-w-2 max-w-32">
                  <Typography variant="subtitle1" className='truncate'>{history.email}</Typography>
                </div>
                <div className="md:min-w-36 md:max-w-56 hidden md:block" >
                  <Typography variant="subtitle1">{history.status}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" className="hidden md:block" color='primary'>
                     <a href={`${BASE_URL}${history.registrationToken}`} target="_blank" rel="noreferrer">Registration Link</a>
                  </Typography>  
                  <Typography variant="subtitle1" className="block md:hidden" color='primary'>
                     <a href={`${BASE_URL}${history.registrationToken}`} target="_blank" rel="noreferrer">Link</a>
                  </Typography>                               
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Onboarding Review
      </CustomTabPanel>
    </Box>
    </div>
    </div>
  );
};

export default HiringManagement;
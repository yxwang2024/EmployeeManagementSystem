import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchHR } from '../store/slices/hr';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../store/hooks';
import { delayFunctionCall } from '../utils/utilities';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
      id={`HM-tabpanel-${index}`}
      aria-labelledby={`HM-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `HM-tab-${index}`,
    'aria-controls': `HM-tabpanel-${index}`,
  };
}


const HiringManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };  

  useEffect(() => {
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

  return (
    <div className='w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto'>
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
    </div>
  );
};

export default HiringManagement;
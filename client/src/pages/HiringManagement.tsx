import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchHR } from '../store/slices/hrM';
import React, { useState, useEffect } from 'react';

const HiringManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const hr = useAppSelector((state) => state.hr);

  useEffect(() => {
    dispatch(fetchHR("1"));
  }, [dispatch]);

  return (
    <div className='w-full flex flex-col h-svh items-center bg-gray-100 space-y-4 py-20 md:pt-24 overflow-y-auto'>
      <h1>Hiring Management</h1>
      <p>{JSON.stringify(hr)}</p>
    </div>
  );
};

export default HiringManagement;
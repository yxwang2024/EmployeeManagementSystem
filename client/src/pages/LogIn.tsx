import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../store/authSlice';
import CustomTextField from '../components/CustomTextField';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
  userType: Yup.string().required('User type is required')
});

const LOGIN_EMPLOYEE_MUTATION = `
  mutation LogInEmployee($input: EmployeeLogin!) {
    logIn(input: $input) {
      token
      employee {
        username
        email
      }
      message
    }
  }
`;

const LOGIN_HR_MUTATION = `
  mutation LogInHR($input: HRLogin!) {
    loginHR(input: $input) {
      token
      hr {
        username
        email
      }
      message
    }
  }
`;

const LogIn: React.FC = () => {
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('Employee');

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const mutation = userType === 'Employee' ? LOGIN_EMPLOYEE_MUTATION : LOGIN_HR_MUTATION;
      const response = await axios.post(
        'http://localhost:3000/graphql',
        {
          query: mutation,
          variables: {
            input: {
              email: values.email,
              password: values.password,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.errors) {
        console.log('Response data errors:', response.data.errors);
        throw new Error(response.data.errors[0].message);
      }

      const { token, employee, hr } = response.data.data.logIn || response.data.data.loginHR;
      localStorage.setItem('token', token);
      dispatch(login({ token, user: employee || hr }));
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Login failed:', errorMessage);
      alert('Login failed: ' + errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-4xl font-bold mb-4 text-gray-800">Log in</h2>
        <Formik
          initialValues={{ email: '', password: '', userType: 'Employee' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <CustomTextField name="email" label="Email Address" type="email" />
              <CustomTextField name="password" label="Password" type="password" />
              <div className="mb-4">
                <label className="block text-gray-700 text-md md:text-xl font-bold mb-2" htmlFor="userType">
                  User Type
                </label>
                <select
                  name="userType"
                  onChange={(e) => {
                    setFieldValue('userType', e.target.value);
                    setUserType(e.target.value);
                  }}
                  className="text-md md:text-xlshadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Employee">Employee</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="text-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign In
                </button>
              </div>
              <div className="mt-4 text-end">
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Forget your password? Reset
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LogIn;
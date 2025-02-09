import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../store/authSlice';
import CustomTextField from '../components/CustomTextField';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmployeeInstanceType } from '../utils/type';

const validationSchema = Yup.object({
  userName: Yup.string().required('User Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SIGNUP_MUTATION = `
  mutation EmployeeRegister($input: EmployeeRegisterInput!) {
    EmployeeRegister(input: $input) {
      token
      message
      user {
        id
        email
        username
        password
        role
        instance {
          ... on EmployeeInstance {
            id
            onboardingApplication {
              id
              status
            }
          }
        }
      }
    }
  }
`;

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParam = (param: string) => {
    return new URLSearchParams(location.search).get(param);
  };

  const handleSignUp = async (values: { userName: string; email: string; password: string }) => {
    try {
      const registrationToken = getQueryParam('registrationToken'); 

      if (!registrationToken) {
        throw new Error('Registration token is required.');
      }

      const response = await axios.post(
        'http://localhost:3000/graphql',
        {
          query: SIGNUP_MUTATION,
          variables: {
            input: {
              username: values.userName,
              email: values.email,
              password: values.password,
              registrationToken,
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
        throw new Error(response.data.errors[0].message);
      }

      const { token, user } = response.data.data.EmployeeRegister;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(login({ token, user }));

      if (user && (user?.instance as EmployeeInstanceType)?.onboardingApplication?.status === 'Approved') {
        navigate('/');
      } else {
        navigate('/onboardingapplication');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Registration failed:', errorMessage);
      if (errorMessage) {
        alert('Registration failed: ' + errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-full max-w-md lg:w-[500px]">
        <h2 className="text-center text-4xl font-bold mb-4 text-gray-800">Sign up</h2>
        <Formik
          initialValues={{ userName: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignUp}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <CustomTextField name="userName" label="User Name" />
              <CustomTextField name="email" label="Email Address" type="email" />
              <CustomTextField name="password" label="Password" type="password" />
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign Up
                </button>
              </div>
              <div className="mt-4 text-end">
                <a href="/login" className="text-blue-500 hover:text-blue-700">
                  Already have an account? Sign in
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../store/authSlice';
import CustomTextField from '../components/CustomTextField';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    Login(input: $input) {
      token
      user {
        id
        username
        email
        role
      }
      message
    }
  }
`;

const LogIn: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const payload = {
        query: LOGIN_MUTATION,
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      };

      console.log('Request payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        'http://localhost:3000/graphql',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Backend response:', JSON.stringify(response.data, null, 2));

      if (response.data.errors) {
        console.log('GraphQL errors:', response.data.errors);
        throw new Error(response.data.errors[0].message);
      }

      const { token, user } = response.data.data.Login;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(login({ token, user }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response);
        if (error.response?.data?.errors) {
          console.error('GraphQL errors:', error.response.data.errors);
          alert(`GraphQL error: ${error.response.data.errors[0].message}`);
        } else {
          alert(`Axios error: ${error.message}`);
        }
      } else {
        console.error('Login failed:', error);
        alert(`${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-4xl font-bold mb-4 text-gray-800">Log in</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <CustomTextField name="email" label="Email Address" type="email" />
              <CustomTextField name="password" label="Password" type="password" />
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
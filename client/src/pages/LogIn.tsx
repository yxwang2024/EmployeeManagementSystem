import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../store/authSlice";
import CustomTextField from "../components/CustomTextField";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
  Login(input: $input) {
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
        ... on HRInstance {
          id
          mailHistory {
            _id
            email
            registrationToken
            expiration
            name
            status
          }
        }
      }
    }
  }
}
`;

const LogIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        "http://localhost:3000/graphql",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log('Backend response:', JSON.stringify(response.data, null, 2));
  
      if (response.data.errors) {
        console.log("GraphQL errors:", response.data.errors);
        throw new Error(response.data.errors[0].message);
      }
  
      const { token, user } = response.data.data.Login;

      if (!token || !user) {
        throw new Error("Invalid response");
      }

      localStorage.setItem("token", token);

      // Decode the token to extract user info if needed
      const decoded: any = jwtDecode(token);
      // check the decoded token
      if (decoded.id !== user.id || decoded.role !== user.role) {
        throw new Error("Token mismatch");
      }

      if (user.role === "Employee") {
        if (user.instance && user.instance.onboardingApplication && user.instance.onboardingApplication.status === "Approved") {
          navigate("/visa-status");
        } else {
          navigate("/onboardingapplication");
        }
      } else if (user.role === "HR") {
        navigate("/mail-history");
      } else {
        throw new Error("Invalid role");
      }

      dispatch(login({ token, user: user }));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        if (error.response?.data?.errors) {
          console.error("GraphQL errors:", error.response.data.errors);
        }
      } else {
        console.error("Login failed:", error);
        alert(`Login failed: ${error.message}`);
      }
    }
  };  

  return (
    <div className="flex items-center w-full justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-center text-4xl font-bold mb-4 text-gray-800">
          Log in
        </h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleSubmit }) => (
            <Form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <CustomTextField
                name="email"
                label="Email Address"
                type="email"
              />
              <CustomTextField
                name="password"
                label="Password"
                type="password"
              />
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

import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import SignIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import VisaStatus from "../pages/VisaStatus";
import OnboardingApplication from "../pages/OnboardingApplication";
import HrVisaStatusManagement from "../pages/HrVisaStatusManagement";
import ErrorPage from "../pages/Error";
import { ProtectedRoute, ProtectedRouteEmployee, ProtectedRouteHR } from "../routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
      },
      {
        path: '/login',
        element: <SignIn />,
        errorElement: <ErrorPage />
      },
      {
        path: '/signup',
        element: <SignUp />,
        errorElement: <ErrorPage />
      },
      {
        path: '/visa-status',
        element: <ProtectedRouteEmployee><VisaStatus /></ProtectedRouteEmployee>,
        errorElement: <ErrorPage />
      },
      {
        path: '/onboardingapplication',
        element: <ProtectedRouteEmployee><OnboardingApplication /></ProtectedRouteEmployee>,
        errorElement: <ErrorPage />
      },
      {
        path: '/hrvisastatusmanagement',
        element: <ProtectedRouteHR><HrVisaStatusManagement /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      {
        path: '/error',
        element: <ErrorPage />,
      }
    ]
  }
]);

export default router;
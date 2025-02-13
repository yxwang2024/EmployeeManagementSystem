import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import SignIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import VisaStatus from "../pages/VisaStatus";
import OnboardingApplication from "../pages/OnboardingApplication";
import HrVisaStatusManagement from "../pages/HrVisaStatusManagement";
import HiringManagement from "../pages/HiringManagement";
import ErrorPage from "../pages/Error";
import { ProtectedRoute, ProtectedRouteEmployee, ProtectedRouteHR } from "../routes/ProtectedRoute";
import VisaStatusDetailedView from "../pages/VisaStatusDetailedView";
import OnboardingDetailedView from "../pages/OnboardingDetailedView";
import Profile from "../pages/Profile";
import HrEmployeeProfiles from "../pages/HrEmployeeProfiles";
import ProfileDetailedView from "../pages/ProfileDetailedView";

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
        path: '/personal-information',

        element: <ProtectedRouteEmployee><Profile /></ProtectedRouteEmployee>,

        errorElement: <ErrorPage />
      },
      {
        path: '/visa-status-management',
        element: <ProtectedRouteHR><HrVisaStatusManagement /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      {
        path: '/visa-status-management/detailed/:id',
        element: <ProtectedRouteHR><VisaStatusDetailedView /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      {
        path: '/employee-profiles',
        element: <ProtectedRouteHR><HrEmployeeProfiles /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      {
        path: '/employee-profiles/detailed/:id',
        element: <ProtectedRouteHR><ProfileDetailedView /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      { 
        path: `/hiring-management`,
        element: <ProtectedRouteHR><HiringManagement /></ProtectedRouteHR>,
        errorElement: <ErrorPage />
      },
      {
        path: '/hiring-management/detailed/:id',
        element: <ProtectedRoute><OnboardingDetailedView /></ProtectedRoute>,
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
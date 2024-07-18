// import SendToken from "./page/SendToken";
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Home from "./pages/Home";
import Header from "./components/Header"
import OnboardingApplication from "./pages/OnboardingApplication";
import DebugPage from "./pages/Debug";
import HrVisaStatusManagement from "./pages/HrVisaStatusManagement";
import DetailedView from "./pages/DetailedView";

const TestHome: React.FC = () => {
  return (
    <>
        <DetailedView />
    </>
  );
}

export default TestHome;
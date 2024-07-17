// import SendToken from "./page/SendToken";
import "./App.css";
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Home from "./pages/Home";
import Header from "./components/Header"
import OnboardingApplication from "./pages/OnboardingApplication";
import { useDispatch } from 'react-redux';
import { rehydrate } from './store/authSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="onboardingapplication" element={<OnboardingApplication />} />
      </Routes>
    </Router>
  );
}

export default App;
// import SendToken from "./page/SendToken";
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Home from "./pages/Home";
import Header from "./components/Header"

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
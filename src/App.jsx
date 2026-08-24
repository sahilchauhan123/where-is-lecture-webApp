import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './screens/Login';
import Home from './screens/Home';
import SelectClass from './screens/SelectClass';
import TabbedLayout from './components/TabbedLayout';
import Weekly from './screens/Weekly';
import Profile from './screens/Profile';
import ReportIssueScreen from './screens/ReportIssueScreen';
import './App.css';
import useAuthStore from './store/useAuthStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <div>Loading...</div>; // Wait for Zustand store to hydrate
  }

  return (
    <GoogleOAuthProvider clientId="258662318660-ve79iue0juple904ddad90v0vk9n7lat.apps.googleusercontent.com">
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
            <Route path="/select-class" element={<SelectClass />} />
            <Route path="/report-issue" element={<ReportIssueScreen />} />
            
            {/* Tabbed Routes */}
            <Route element={<TabbedLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

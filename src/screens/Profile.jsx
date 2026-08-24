import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useLectureStore from '../store/useLectureStore';
import { LogIn, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, isInitialized } = useAuthStore(state => state);
  const authLogout = useAuthStore(state => state.logout);
  const lectureLogout = useLectureStore(state => state.logout);
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(user);
  }, [user, isInitialized]);

  const signOut = () => {
    authLogout();
    lectureLogout();
    sessionStorage.clear();
    localStorage.clear();
    console.log("  user data after log out")
    navigate('/', { replace: true });
  };

  if (!userData || !userData.data) return null;

  return (
    <div className="profile-container">
      <div className="profile-header-section">
        <img
          src={userData.data.user.photo || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-large-img"
        />
        <span className="profile-name-text font-bold">
          {userData.data.user.givenName} {userData.data.user.familyName}
        </span>
        <span className="profile-email-text font-medium">
          {userData.data.user.email}
        </span>
      </div>

      <div className="profile-options-section">
        {/* Change Class */}
        <button className="profile-option-btn" onClick={() => navigate('/select-class')}>
          <div className="profile-divider"></div>
          <div className="profile-option-row">
            <LogIn size={32} color="var(--grey)" />
            <span className="profile-option-text font-semibold">Change Class</span>
            <ChevronRight size={30} color="var(--grey)" />
          </div>
        </button>

        {/* Feedback */}
        <button className="profile-option-btn" onClick={() => navigate('/report-issue')}>
          <div className="profile-divider"></div>
          <div className="profile-option-row">
            <HelpCircle size={32} color="var(--grey)" />
            <span className="profile-option-text font-semibold">Feedback</span>
            <ChevronRight size={30} color="var(--grey)" />
          </div>
        </button>

        {/* Logout */}
        <button className="profile-option-btn" onClick={signOut}>
          <div className="profile-divider"></div>
          <div className="profile-option-row">
            <LogOut size={28} color="var(--grey)" />
            <span className="profile-option-text font-semibold">Logout</span>
            <ChevronRight size={30} color="var(--grey)" />
          </div>
        </button>
      </div>

      <div className="profile-divider mt-2"></div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import useLectureStore from '../store/useLectureStore';

import sahilLogo from '../assets/images/sahillogo.png';
import gmailLogo from '../assets/images/gmail-signin.png';
import './Login.css';

const Login = () => {
  const setUser = useAuthStore(state => state.setUser);
  const setClassThroughLogin = useLectureStore(state => state.setClassThroughLogin);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoader(true);
        // We get access_token from tokenResponse. Fetch user info directly from Google API.
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();
        
        await handleSuccessfulAuth(googleUser);
      } catch (error) {
        console.error('Google user info fetch error:', error);
        setLoader(false);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setLoader(false);
    }
  });

  const handleSuccessfulAuth = async (googleUser) => {
    try {
      const userPayload = {
        data: {
          user: {
            email: googleUser.email,
            givenName: googleUser.given_name || '',
            familyName: googleUser.family_name || '',
            photo: googleUser.picture || '',
            id: googleUser.sub // sub is the google user ID
          }
        }
      };

      console.log('userPayload', userPayload);
      const email = googleUser.email;
      
      const usersRef = collection(db, 'Users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const uploadSuccess = await uploadUserToFirestore(userPayload.data.user);
        if (uploadSuccess) {
          setUser(userPayload);
          navigate('/select-class');
        } else {
          setLoader(false);
        }
      } else {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.class) {
          setClassThroughLogin(userData.class);
          setUser(userPayload);
          navigate('/home');
        } else {
          setUser(userPayload);
          navigate('/select-class');
        }
      }
    } catch (error) {
      console.error('Auth Processing Error:', error);
      setLoader(false);
      setClassThroughLogin(null);
      setUser(null);
    }
  };

  const uploadUserToFirestore = async (user) => {
    try {
      const email = user.email;
      await setDoc(doc(db, 'Users', email), {
        email: email,
        firstName: user.givenName || 'User',
        lastName: user.familyName || '',
        photo: user.photo || '',
        class: null,
      });
      console.log('User added to Firestore!');

      const mockToken = "web-mock-token-" + Date.now();
      await updateDoc(doc(db, 'Users', email), {
        deviceTokens: arrayUnion(mockToken),
      });

      console.log('device token added');
      return true;
    } catch (error) {
      console.error('Error uploading user to Firestore:', error);
      return false;
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-section">
        <img src={sahilLogo} alt="Logo" className="login-image" />
        <p className="login-subtitle font-semibold">
          Get Notified 5 minutes before Lectures
        </p>
      </div>

      {loader ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <button 
          className="google-signin-btn" 
          onClick={() => {
            setLoader(true);
            login();
          }}
        >
          <img src={gmailLogo} alt="Google" className="google-icon" />
          <span className="google-text font-semibold">Continue With Google</span>
        </button>
      )}
    </div>
  );
};

export default Login;

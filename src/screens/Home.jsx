import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useLectureStore from '../store/useLectureStore';
import LectureDetails from './LectureDetails';
import './Home.css';

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const lecture = useLectureStore((state) => state.data);
  const className = useLectureStore((state) => state.className);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('');
  const [today, setToday] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [batchName, setBatchName] = useState(className);
  const [lectureLength, setLectureLength] = useState(0);

  const updateGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 4 && hours <= 12) setGreeting('Good Morning 👋');
    else if (hours >= 13 && hours <= 15) setGreeting('Good Afternoon 👋');
    else if (hours >= 16 && hours <= 19) setGreeting('Good Evening 👋');
    else setGreeting('Good Night 😴');

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    setToday(todayName);

    const date = new Date();
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    setFullDate(`${day} ${month} ${year}`);

    // Calculate length of lectures
    if (lecture && lecture.lectures && todayName.toLowerCase() in lecture.lectures) {
      let size = lecture.lectures[todayName.toLowerCase()].length;
      lecture.lectures[todayName.toLowerCase()].forEach((data) => {
        if (data.lecture_name === "LUNCH BREAK" || data.lecture_name === "TEA BREAK") {
          size--;
        }
      });
      setLectureLength(size);
    } else {
      setLectureLength(0);
    }
  };

  useEffect(() => {
    setBatchName(className);
    if (className && lecture) {
      updateGreeting();
    }
  }, [className, lecture]);

  if (!user || !user.data) return null; // Safe guard

  return (
    <div className="home-safe-area">
      <div className="header-row">
        <div className="header-text-container">
          <span className="greeting-text font-semibold">{greeting}</span>
          <span className="name-text font-bold">{user.data.user.givenName}</span>
        </div>
        
        <div className="header-profile-container">
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <img 
              src={user.data.user.photo || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="profile-img" 
            />
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-top-row">
          <div className="date-col">
            <span className="today-name font-semibold">{today}</span>
            <span className="full-date font-semibold">{fullDate}</span>
          </div>
          <div className="class-col">
            <span className="class-label font-light">Class</span>
            <span className="class-name font-semibold">{batchName}</span>
          </div>
        </div>
        
        <div className="lecture-count-pill">
          <span className="lecture-count-text font-medium">
            Today there are {lectureLength} lectures
          </span>
        </div>
      </div>

      <div className="table-header-row">
        <span className="table-header-text font-medium">Time</span>
        <span className="table-header-text font-medium ml-header">Lectures</span>
      </div>

      <div className="home-scroll-view">
        <LectureDetails item={today} />
      </div>
    </div>
  );
};

export default Home;

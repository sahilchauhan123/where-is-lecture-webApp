import React, { useEffect, useState } from 'react';
import useLectureStore from '../store/useLectureStore';
import moment from 'moment';
import './LectureDetails.css';

import pinWhite from '../assets/images/pin_white.png';
import pinGrey from '../assets/images/pin_grey.png';
import userProfileWhite from '../assets/images/user-profile-white.png';
import userProfileGrey from '../assets/images/user-profile-grey.png';

const LongLengthLecture = ({ item }) => {
  return (
    <div className="lecture-item-container">
      <div className="lecture-time-col">
        <span className="time-start font-medium">{item.time}</span>
        <span className="time-end font-medium">{item.end_time}</span>
      </div>
      <div className="lecture-card-long">
        <span className="lecture-title-long font-semibold">{item.lecture_name}</span>
      </div>
    </div>
  );
};

const BreakComponent = ({ item }) => {
  return (
    <div className="lecture-item-container">
      <div className="lecture-time-col">
        <span className="time-start font-medium">{item.time}</span>
        <span className="time-end font-medium">{item.end_time}</span>
      </div>
      <div className="lecture-card-break">
        <span className="break-title font-semibold">{item.lecture_name}</span>
      </div>
    </div>
  );
};

const LectureDetails = ({ item }) => {
  const data = useLectureStore((state) => state.data);
  const [classData, setClassData] = useState();
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
  const [lectureAvailable, setLectureAvailable] = useState(false);

  useEffect(() => {
    if (item && data) {
      const todayLower = item.toLowerCase();
      console.log(todayLower);
      if (data.lectures && todayLower in data.lectures) {
        setClassData(data.lectures[todayLower]);
        setLectureAvailable(true);
      } else {
        console.log("no lecture today");
        setLectureAvailable(false);
      }
    }

    const interval = setInterval(() => {
      setCurrentTime(moment().format('HH:mm'));
    }, 60000);

    return () => clearInterval(interval);
  }, [item, data]);

  const isLectureOngoing = (lecture) => {
    const startTime = moment(lecture.time, 'HH:mm');
    const endTime = moment(lecture.end_time, 'HH:mm');
    const now = moment(currentTime, 'HH:mm');
    return now.isSameOrAfter(startTime) && now.isBefore(endTime);
  };

  const renderLectureComponent = (lecture, index) => {
    if (lecture.lecture_name === 'LUNCH BREAK' || lecture.lecture_name === 'TEA BREAK') {
      return <BreakComponent key={index} item={lecture} />;
    }
    
    if (lecture.lecture_name.length > 50) {
      return <LongLengthLecture key={index} item={lecture} />;
    }

    const ongoing = isLectureOngoing(lecture);

    return (
      <div key={index} className="lecture-item-container">
        <div className="lecture-time-col">
          <span className="time-start font-medium">{lecture.time}</span>
          <span className="time-end font-medium">{lecture.end_time}</span>
        </div>

        <div className={`lecture-card-normal ${ongoing ? 'ongoing' : ''}`}>
          <span className="lecture-title font-semibold">{lecture.lecture_name}</span>
          
          <div className="lecture-info-row">
            <div className="lecture-icons-col">
              <img src={ongoing ? pinWhite : pinGrey} alt="pin" className="icon-pin" />
              <img src={ongoing ? userProfileWhite : userProfileGrey} alt="user" className="icon-user" />
            </div>
            <div className="lecture-text-col">
              <span className="info-text font-medium">{lecture.venue}</span>
              <span className="info-text font-medium mt-half">{lecture.faculty}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lecture-details-wrapper">
      {lectureAvailable ? (
        <div className="lecture-list">
          {classData && classData.map((lecture, index) => renderLectureComponent(lecture, index))}
        </div>
      ) : (
        <div className="no-lecture-card">
          <span className="no-lecture-text font-semibold">No Lecture Available</span>
        </div>
      )}
      <div className="bottom-padding"></div>
    </div>
  );
};

export default LectureDetails;

import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import LectureDetails from '../screens/LectureDetails';
import { todayTime } from '../utils/constants';
import './CustomCalendar.css';

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const scrollRef = useRef(null);
  
  const [timming, setTimming] = useState(todayTime);

  const generateDates = () => {
    let dates = [];
    for (let i = -30; i <= 30; i++) {
      dates.push(moment().add(i, 'days'));
    }
    return dates;
  };

  const [dates] = useState(generateDates());
  const todayIndex = dates.findIndex(date => date.isSame(moment(), 'day'));

  useEffect(() => {
    if (scrollRef.current) {
      // Approximate centering item (15vw width roughly 60px on mobile)
      // Web specific smooth scroll to center today's date
      const itemWidth = window.innerWidth <= 480 ? window.innerWidth * 0.15 : 72; // 15vw or 72px
      const centerOffset = (scrollRef.current.clientWidth / 2) - (itemWidth / 2);
      scrollRef.current.scrollLeft = (todayIndex * itemWidth) - centerOffset;
    }
  }, [todayIndex]);

  const handleDateSelect = (date, index) => {
    setSelectedDate(date);
    if (scrollRef.current) {
      const itemWidth = window.innerWidth <= 480 ? window.innerWidth * 0.15 : 72;
      const centerOffset = (scrollRef.current.clientWidth / 2) - (itemWidth / 2);
      scrollRef.current.scrollTo({
        left: (index * itemWidth) - centerOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div>
          <span className="calendar-day-large font-semibold">{timming.day}</span>
        </div>
        <div className="calendar-month-info">
          <span className="calendar-today-name font-medium">{timming.todayName}</span>
          <span className="calendar-month-year font-medium">{timming.month} {timming.year}</span>
        </div>
      </div>

      <div className="calendar-dates-scroll-wrapper">
        <div className="calendar-dates-scroll" ref={scrollRef}>
          {dates.map((item, index) => {
            const isSelected = item.isSame(selectedDate, 'day');
            return (
              <button 
                key={index} 
                className="date-touchable"
                onClick={() => handleDateSelect(item, index)}
              >
                <div className={`date-container ${isSelected ? 'selected-date-container' : ''}`}>
                  <span className={`day-text font-semibold ${isSelected ? 'selected-date-text' : ''}`}>
                    {item.format('ddd')}
                  </span>
                  <span className={`date-text font-medium ${isSelected ? 'selected-date-text' : ''}`}>
                    {item.format('DD')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="table-header-row">
        <span className="table-header-text font-medium">Time</span>
        <span className="table-header-text font-medium ml-header">Lectures</span>
      </div>
      
      <div className="calendar-details-scroll">
        <LectureDetails item={selectedDate.format('dddd')} />
      </div>
    </div>
  );
};

export default CustomCalendar;

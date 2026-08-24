import React from 'react';
import CustomCalendar from '../components/CustomCalendar';

const Weekly = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'white' }}>
      <CustomCalendar />
    </div>
  );
};

export default Weekly;

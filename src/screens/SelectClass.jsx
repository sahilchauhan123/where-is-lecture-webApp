import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import useAuthStore from '../store/useAuthStore';
import useLectureStore from '../store/useLectureStore';
import './SelectClass.css';

import selectScreenBg from '../assets/images/select_screen_bg.png';

const SelectClass = () => {
  const [classNames, setClassNames] = useState([]);
  const [value, setValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [next, setNext] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const { setClassName, className } = useLectureStore();
  const navigate = useNavigate();

  const fetchBatchesName = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'test10'));
      const documentNames = querySnapshot.docs
        .map(doc => ({
          label: doc.id,
          value: doc.id
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Document Names:', documentNames);
      setClassNames(documentNames);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updateClass = async (selectedClass) => {
    try {
      if (user?.data?.user?.email) {
        await updateDoc(doc(db, 'Users', user.data.user.email), {
          class: selectedClass
        });
        console.log('User updated!');
        setNext(true);

        // Web specific mock for token
        const mockToken = "web-mock-token-" + Date.now();
        await updateDoc(doc(db, "test10", selectedClass), {
          deviceTokens: arrayUnion(mockToken),
        });
        console.log('token updated');
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const handleNext = () => {
    if (next) {
      navigate('/home');
    }
  };

  useEffect(() => {
    fetchBatchesName();
  }, []);

  const filteredClasses = classNames.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="select-class-container">
      <div className="select-image-wrapper">
        <img src={selectScreenBg} alt="Select Class Background" className="select-image" />
      </div>

      <div className="select-content">
        <h1 className="select-title font-bold">Select class</h1>

        <div className="custom-dropdown-container">
          <button 
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className={`font-regular ${value ? 'text-black' : 'text-gray'}`}>
              {value || 'Select your class'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <input 
                type="text" 
                className="dropdown-search font-regular"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="dropdown-list">
                {filteredClasses.map((item, index) => (
                  <button 
                    key={index} 
                    className="dropdown-item font-regular"
                    onClick={async () => {
                      setValue(item.value);
                      setDropdownOpen(false);
                      setSearchQuery('');
                      await updateClass(item.value);
                      setClassName(item.value);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className={`next-button font-medium ${!next ? 'opacity-half' : ''}`}
          onClick={handleNext}
          disabled={!next}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default SelectClass;

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Settings } from 'lucide-react';
import './TabbedLayout.css';

const TabbedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Weekly', path: '/weekly', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: Settings },
  ];

  return (
    <div className="tabbed-layout-container">
      {/* Main Content Area */}
      <div className="tabbed-layout-content">
        <Outlet />
      </div>

      {/* Bottom Tab Bar */}
      <div className="bottom-tabs-container">
        {tabs.map((tab) => {
          const isFocused = location.pathname.startsWith(tab.path);
          const IconComponent = tab.icon;
          
          return (
            <button 
              key={tab.name}
              className="tab-button"
              onClick={() => navigate(tab.path)}
            >
              <IconComponent 
                size={24} 
                color={isFocused ? 'var(--primary)' : 'gray'} 
                strokeWidth={isFocused ? 2.5 : 2}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabbedLayout;

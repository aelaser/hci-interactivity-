import React from 'react';
import '../App.css' // Path to your CSS file

function CustomArrowIcon({ isOpen }) {
  return (
    <div className={`arrow-icon ${isOpen ? 'open' : ''}`}>
      <span className="left-bar"></span>
      <span className="right-bar"></span>
    </div>
  );
}

export default CustomArrowIcon;

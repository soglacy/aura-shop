// src/components/common/SectionSeparator.jsx
import React from 'react';

const SectionSeparator = () => {
  return (
    <div className="relative -mt-1 md:-mt-10 lg:-mt-20 z-10 pointer-events-none">
      <svg
        className="w-full h-auto"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1440,21.2101911 C1200.48273,75.2735452 960.243572,102.830219 720,102.830219 C479.756428,102.830219 239.517274,75.2735452 0,21.2101911 L0,120 L1440,120 L1440,21.2101911 Z"
          // Цвет должен совпадать с фоном следующей секции (bg-brand-bg-dark)
          fill="#111827" 
        ></path>
      </svg>
    </div>
  );
};

export default SectionSeparator;
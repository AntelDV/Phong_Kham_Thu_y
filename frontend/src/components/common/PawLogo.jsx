import React from 'react';

const PawLogo = () => {
  return (
    <div className="paw-logo-container d-flex align-items-center justify-content-center">
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          .paw-icon {
            font-size: 2rem;
            color: #ec4899; /* Màu hồng đậm */
            animation: wiggle 2s ease-in-out infinite;
            filter: drop-shadow(0 2px 4px rgba(236, 72, 153, 0.3));
          }
        `}
      </style>
      <i className="bi bi-paw-fill paw-icon"></i>
    </div>
  );
};

export default PawLogo;
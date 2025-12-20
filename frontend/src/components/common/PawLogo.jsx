import React from 'react';
import { motion } from 'framer-motion';

const PawLogo = ({ width = 40, color = 'currentColor' }) => {
  return (
    <motion.svg
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.2, rotate: 10 }}
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        repeatType: "reverse",
        ease: "easeInOut" 
      }}
    >
      <path
        d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM6 6C4.9 6 4 6.9 4 8C4 9.1 4.9 10 6 10C7.1 10 8 9.1 8 8C8 6.9 7.1 6 6 6ZM18 6C16.9 6 16 6.9 16 8C16 9.1 16.9 10 18 10C19.1 10 20 9.1 20 8C20 6.9 19.1 6 18 6ZM6 12C4.34 12 3 13.34 3 15C3 17.5 5 20 8 21.5C8.89 21.94 10.4 22 12 22C13.6 22 15.11 21.94 16 21.5C19 20 21 17.5 21 15C21 13.34 19.66 12 18 12C17.11 12 16.31 12.4 15.76 13.06C14.71 14.32 13.29 15 12 15C10.71 15 9.29 14.32 8.24 13.06C7.69 12.4 6.89 12 6 12Z"
        fill={color}
      />
    </motion.svg>
  );
};

export default PawLogo;
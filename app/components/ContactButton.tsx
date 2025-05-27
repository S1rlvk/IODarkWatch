import React from 'react';
import styles from '../styles/ContactButton.module.css';

export const ContactButton: React.FC = () => {
  return (
    <div className={styles.contactButton}>
      <a 
        href="mailto:ssattigeri65@gmail.com?subject=IODarkWatch%20Inquiry&body=Hello%20there,%0A%0AI%20found%20your%20maritime%20domain%20awareness%20platform%20and%20would%20like%20to%20get%20in%20touch.%0A%0ABest%20regards"
        className={styles.button}
      >
        <svg 
          className={styles.icon}
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        Contact Us
      </a>
    </div>
  );
}; 
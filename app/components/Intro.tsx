'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Intro.module.css';

const Intro: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const fullText = 'IODarkWatch';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const handleEnter = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.introContainer}>
      <div className={styles.content} style={{ opacity: isVisible ? 1 : 0 }}>
        <h1 className={styles.title}>
          {currentText}
          <span className={styles.cursor}>|</span>
        </h1>
        <p className={styles.subtitle}>
          Maritime Intelligence Platform
        </p>
        <div className={styles.description}>
          <p>Advanced vessel tracking and dark vessel detection</p>
          <p>Powered by satellite data and machine learning</p>
        </div>
        <button 
          className={styles.enterButton}
          onClick={handleEnter}
          style={{ opacity: currentIndex === fullText.length ? 1 : 0 }}
        >
          Enter Platform
        </button>
      </div>

      <div className={styles.background}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>
    </div>
  );
};

export default Intro; 
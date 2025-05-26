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
          Open-Source Maritime Domain Awareness for the Indian Ocean
        </p>
        <div className={styles.description}>
          <p>Multi-Source Intelligence: AIS broadcasts, Sentinel-2 imagery, and SAR snapshots</p>
          <p>AI-Powered Detection: ML pipeline for dark vessel identification</p>
          <p>Open Access: Live dashboard, REST API, and weekly briefs</p>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Dark Vessels</h3>
            <p>Thousands of vessels run "dark," hiding illegal activities</p>
          </div>
          <div className={styles.feature}>
            <h3>Limited Visibility</h3>
            <p>Expensive tools and lack of public surveillance feeds</p>
          </div>
          <div className={styles.feature}>
            <h3>Our Solution</h3>
            <p>Advanced fusion algorithms and AI-powered detection</p>
          </div>
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
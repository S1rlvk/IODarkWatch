'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Intro.module.css';

export default function Intro() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleEnterPlatform = () => {
    setIsLoading(true);
    router.push('/dashboard');
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>IODarkWatch</span>
        </h1>
        <p className={styles.subtitle}>
          Open-Source Maritime Domain Awareness for the Indian Ocean
        </p>
        <div className={styles.description}>
          <p>Multi-Source Intelligence: AIS broadcasts, Sentinel-2 imagery, and SAR snapshots.</p>
          <p>AI-Powered Detection: ML pipeline for dark vessel identification.</p>
          <p>Open Access: Live dashboard, REST API, and weekly briefs.</p>
        </div>
        <button
          className={`${styles.enterButton} ${isLoading ? styles.loading : ''}`}
          onClick={handleEnterPlatform}
          disabled={isLoading}
        >
          {isLoading ? 'Entering Platform...' : 'Enter Platform'}
        </button>
      </div>
    </div>
  );
} 
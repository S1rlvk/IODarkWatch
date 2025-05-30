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

        <div className={styles.aimSection}>
          <h2 className={styles.aimTitle}>Our Aim</h2>
          <div className={styles.aimContent}>
            <div className={styles.aimCard}>
              <h3>Maritime Security</h3>
              <p>Enhancing maritime domain awareness through advanced technology and open-source intelligence to ensure safer waters in the Indian Ocean region.</p>
            </div>
            <div className={styles.aimCard}>
              <h3>Transparency</h3>
              <p>Providing accessible and transparent maritime data to empower stakeholders in making informed decisions about maritime security and safety.</p>
            </div>
            <div className={styles.aimCard}>
              <h3>Innovation</h3>
              <p>Leveraging cutting-edge AI and machine learning technologies to detect and monitor dark vessels, contributing to a more secure maritime environment.</p>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.license}>
            <p>Licensed under the MIT License</p>
          </div>
          <div className={styles.builtWith}>
            <p>Built with ❤️ for India</p>
          </div>
        </footer>
      </div>
    </div>
  );
} 
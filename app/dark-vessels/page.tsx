'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DarkVessels.module.css';

const DarkVesselsPage: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content} style={{ opacity: isVisible ? 1 : 0 }}>
        <h1 className={styles.title}>
          <span className={styles.highlight}>Dark Vessels</span> in the Indian Ocean
        </h1>
        
        <div className={styles.infoCard}>
          <h2>The Hidden Threat</h2>
          <p>
            Dark vessels, ships that deliberately disable their Automatic Identification System (AIS) 
            transponders, pose a significant security challenge in the Indian Ocean. This vast maritime 
            region, spanning over 70 million square kilometers, has become a hotspot for illicit 
            activities including illegal fishing, smuggling, and potential security threats.
          </p>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>70M+</span>
              <span className={styles.statLabel}>Square Kilometers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Dark Vessels Daily</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>$2B+</span>
              <span className={styles.statLabel}>Annual Loss</span>
            </div>
          </div>

          <h2>National Security Implications</h2>
          <p>
            The presence of dark vessels in the Indian Ocean raises serious national security concerns. 
            These vessels can evade traditional maritime surveillance systems, potentially enabling 
            unauthorized activities near sensitive coastal areas. The region's strategic importance 
            for global trade and energy transport makes it crucial to maintain maritime domain 
            awareness and prevent potential security breaches.
          </p>

          <div className={styles.threats}>
            <div className={styles.threatItem}>
              <div className={styles.threatIcon}>🚢</div>
              <h3>Illegal Fishing</h3>
              <p>Depleting marine resources and threatening local economies</p>
            </div>
            <div className={styles.threatItem}>
              <div className={styles.threatIcon}>🚫</div>
              <h3>Smuggling</h3>
              <p>Undermining border security and economic stability</p>
            </div>
            <div className={styles.threatItem}>
              <div className={styles.threatIcon}>⚠️</div>
              <h3>Security Threats</h3>
              <p>Potential risks to coastal security and maritime infrastructure</p>
            </div>
          </div>
        </div>

        <button 
          className={styles.backButton}
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
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

export default DarkVesselsPage; 
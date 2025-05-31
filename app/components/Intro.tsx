'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Shield, Zap, Globe, Activity, Users, TrendingUp, ArrowRight, Play, CheckCircle, Satellite, MapPin, Clock } from 'lucide-react';
import styles from './Intro.module.css';

export default function Intro() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  // Animated statistics
  const stats = [
    { label: 'Vessels Tracked Daily', value: '15,000+', icon: MapPin },
    { label: 'Dark Ships Detected', value: '1,247', icon: Eye },
    { label: 'Ocean Coverage', value: '100%', icon: Globe },
    { label: 'Detection Accuracy', value: '94.2%', icon: TrendingUp }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const handleEnterPlatform = () => {
    setIsLoading(true);
    router.push('/dashboard');
  };

  const handleWatchDemo = () => {
    // For now, scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Eye,
      title: 'All-Weather Detection',
      description: 'SAR and optical satellite imagery fusion for 24/7 maritime surveillance, regardless of weather conditions.'
    },
    {
      icon: Globe,
      title: '100% Ocean Coverage',
      description: 'Complete visibility across the Indian Ocean with persistent monitoring of all maritime activities.'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'AI-powered detection pipeline processes satellite data within 30 minutes of acquisition.'
    },
    {
      icon: Shield,
      title: 'Open Intelligence',
      description: 'Transparent, open-source approach to maritime domain awareness with public API access.'
    }
  ];

  const solutions = [
    {
      title: 'Naval Operations',
      description: 'Enhanced maritime domain awareness for naval forces with real-time dark vessel alerts and tracking.',
      applications: ['Threat Detection', 'Border Security', 'Maritime Patrol']
    },
    {
      title: 'Port Security',
      description: 'Monitor harbor approaches and detect unauthorized vessels near critical maritime infrastructure.',
      applications: ['Harbor Protection', 'Critical Infrastructure', 'Access Control']
    },
    {
      title: 'Fisheries Management',
      description: 'Combat illegal, unreported, and unregulated (IUU) fishing with automated detection systems.',
      applications: ['IUU Detection', 'Fleet Monitoring', 'Compliance Tracking']
    },
    {
      title: 'Research & Academia',
      description: 'Open datasets and APIs for maritime research, environmental monitoring, and academic studies.',
      applications: ['Data Access', 'Research Tools', 'Academic Collaboration']
    }
  ];

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}></div>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.announcement}>
            🚀 Now tracking 15,000+ vessels daily across the Indian Ocean
          </div>
          
          <h1 className={styles.heroTitle}>
            <span className={styles.gradient}>Persistent Maritime</span><br />
            Surveillance for the<br />
            <span className={styles.highlight}>Indian Ocean</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Open-source maritime domain awareness combining AIS data, satellite imagery, 
            and AI-powered detection to identify dark vessels and enhance maritime security.
          </p>

          <div className={styles.heroButtons}>
            <button
              className={`${styles.primaryButton} ${isLoading ? styles.loading : ''}`}
              onClick={handleEnterPlatform}
              disabled={isLoading}
            >
              {isLoading ? 'Entering Platform...' : 'Access Platform'}
              <ArrowRight className={styles.buttonIcon} />
            </button>
            
            <button className={styles.secondaryButton} onClick={handleWatchDemo}>
              <Play className={styles.buttonIcon} />
              Watch Demo
            </button>
          </div>

          {/* Live Statistics */}
          <div className={styles.liveStats}>
            <div className={styles.statItem}>
              {React.createElement(stats[currentStat].icon, { className: styles.statIcon })}
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats[currentStat].value}</div>
                <div className={styles.statLabel}>{stats[currentStat].label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Advantages of SAR + AIS + AI</h2>
            <p className={styles.sectionSubtitle}>
              Our multi-source intelligence platform combines satellite technology with advanced AI 
              to deliver unprecedented maritime domain awareness.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {React.createElement(feature.icon)}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className={styles.solutions}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Future of Maritime Intelligence</h2>
            <p className={styles.sectionSubtitle}>
              Traditional maritime surveillance can&apos;t deliver real-time insights. With 30-minute 
              detection cycles, IODarkWatch unlocks opportunities like never before.
            </p>
          </div>

          <div className={styles.solutionsGrid}>
            {solutions.map((solution, index) => (
              <div key={index} className={styles.solutionCard}>
                <h3 className={styles.solutionTitle}>{solution.title}</h3>
                <p className={styles.solutionDescription}>{solution.description}</p>
                <ul className={styles.applicationsList}>
                  {solution.applications.map((app, appIndex) => (
                    <li key={appIndex} className={styles.applicationItem}>
                      <CheckCircle className={styles.checkIcon} />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={styles.technology}>
        <div className={styles.sectionContent}>
          <div className={styles.techGrid}>
            <div className={styles.techContent}>
              <h2 className={styles.sectionTitle}>Open-Source Maritime Intelligence</h2>
              <p className={styles.techDescription}>
                IODarkWatch democratizes maritime domain awareness through open-source technology, 
                transparent methodologies, and accessible APIs. Built for the global maritime community.
              </p>
              
              <div className={styles.techFeatures}>
                <div className={styles.techFeature}>
                  <Satellite className={styles.techIcon} />
                  <div>
                    <h4>Multi-Source Data Fusion</h4>
                    <p>AIS broadcasts, Sentinel-2 imagery, and SAR snapshots</p>
                  </div>
                </div>
                
                <div className={styles.techFeature}>
                  <Activity className={styles.techIcon} />
                  <div>
                    <h4>AI-Powered Detection</h4>
                    <p>YOLOv8 fine-tuned for maritime vessel identification</p>
                  </div>
                </div>
                
                <div className={styles.techFeature}>
                  <Clock className={styles.techIcon} />
                  <div>
                    <h4>Real-Time Correlation</h4>
                    <p>Dark vessel detection within 30-minute processing windows</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.techVisual}>
              <div className={styles.dataFlow}>
                <div className={styles.dataSource}>AIS Data</div>
                <div className={styles.dataSource}>Sentinel-2</div>
                <div className={styles.dataSource}>SAR</div>
                <div className={styles.processor}>AI Detection</div>
                <div className={styles.output}>Dark Vessel Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Explore Maritime Intelligence?</h2>
          <p className={styles.ctaSubtitle}>
            Join researchers, naval analysts, and maritime professionals using IODarkWatch 
            for enhanced situational awareness across the Indian Ocean.
          </p>
          
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton} onClick={handleEnterPlatform}>
              Access Live Platform
              <ArrowRight className={styles.buttonIcon} />
            </button>
            
            <a 
              href="https://github.com/sarthak215s/IODarkWatch" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              <Globe className={styles.buttonIcon} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>IODarkWatch</h3>
            <p>Open-source maritime domain awareness for the Indian Ocean region</p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Platform</h4>
            <ul>
              <li><a href="/dashboard">Live Dashboard</a></li>
              <li><a href="/api">API Documentation</a></li>
              <li><a href="/data">Open Datasets</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Documentation</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Research Papers</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Case Studies</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Community</h4>
            <ul>
              <li><a href="https://github.com/sarthak215s/IODarkWatch" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="mailto:ssattiger65@gmail.com">Contact</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Contribute</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 IODarkWatch. Licensed under MIT License.</p>
          <p>Built with ❤️ for maritime security in the Indian Ocean</p>
        </div>
      </footer>
    </div>
  );
} 
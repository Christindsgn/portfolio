import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import OrbitEllipseLight from './OrbitEllipseLight';
import PasswordModal from './PasswordModal';
import { initGA, trackResumeDownload, trackEmailClick, trackSocialLinkClick, trackPortfolioView } from '../utils/analytics';

const PortfolioPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const emailAddress = 'christinsibi333@gmail.com';
  const sunShadowDirection = { x: 0, y: 1 };

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  const handlePasswordSubmit = (password: string): string | void => {
    // Simple password validation - you can change this password
    const correctPassword = "portfolio2025"; // Change this to your desired password
    
    if (password === correctPassword) {
      // Redirect to the Google Drive link
      window.open('https://www.figma.com/deck/ZyjncwO5c62u35FiwLTRAE/Portfolio-Oct-2025?node-id=1-935&t=2qFMh5i2hY8uLdMH-1', '_blank');
      setIsModalOpen(false);
    } else {
      // Return error message to show in modal
      return "Wrong password!";
    }
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    trackEmailClick();
    
    try {
      await navigator.clipboard.writeText(emailAddress);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 5000);
    } catch (err) {
      // Fallback copy method
      const textarea = document.createElement('textarea');
      textarea.value = emailAddress;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 5000);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="portfolio-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="logo-section">
          <div className="logo-background">
            <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40.9492 40.7812H0.949219V0.78125H40.9492V40.7812ZM20.9482 10.1699C12.0486 10.1699 4.83398 14.9207 4.83398 20.7812C4.83398 26.6418 12.0486 31.3926 20.9482 31.3926C29.8479 31.3926 37.0625 26.6418 37.0625 20.7812C37.0625 14.9207 29.8479 10.1699 20.9482 10.1699Z" fill="black"/>
            </svg>
          </div>
          {/* <span className="name-text">CHRISTIN SIBI</span> */}
        </div>
        
        <div className="navigation-section">
          <div className="nav-links" style={{ display: 'none' }}>
            <span className="nav-link">About</span>
            <span className="nav-link">Experiments</span>
          </div>
          <button className="resume-button" onClick={() => {
            trackResumeDownload();
            window.open('/Resume-Christin_Sibi-For Portfolio.pdf', '_blank');
          }}>
            <span>Resume</span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <div className="left-content">
          <h1 className="main-heading">Christin Sibi</h1>
          <p className="description">
            <span className="regular-text">Currently leading design at </span>
            <span className="highlighted-link">ops0</span>
            <span className="regular-text margin-bottom-16">, creating AI-powered developer tools that streamline infrastructure management.</span>
      
            <span className="regular-text"> Previously, designed </span>
            <span className="highlighted-link">Stoqs.ai</span>
            <span className="regular-text">, defining generative UX that transforms how users interact with financial AI.</span>
          </p>
          
          <div className="cta-section">
            <button className="portfolio-button" onClick={() => {
              trackPortfolioView();
              setIsModalOpen(true);
            }}>
              <span>View Portfolio Deck</span>
            </button>
            {/* <p className="read-time">2 min read</p> */}
          </div>
        </div>

        {/* Right Side Ellipse Arrangement via reusable component */}
        <div className="right-content">
          <OrbitEllipseLight
            width={394}
            height={353}
            numOrbits={7}
            centerSize={{ width: 48, height: 40 }}
            orbitSize={{ width: 48, height: 40 }}
            showLightCursor={false}
            sunShadowDirection={sunShadowDirection}
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer-section">
        <div className="footer-links">
          <div className="footer-links-left">
            <a href="https://www.linkedin.com/in/christin-sibi/" target="_blank" rel="noopener noreferrer" className="footer-link" onClick={() => trackSocialLinkClick('linkedin')}>LinkedIn</a>
            <a href="https://www.behance.net/christinsibi" target="_blank" rel="noopener noreferrer" className="footer-link" onClick={() => trackSocialLinkClick('behance')}>Behance</a>
            <a href="https://dribbble.com/christin-sibi" target="_blank" rel="noopener noreferrer" className="footer-link" onClick={() => trackSocialLinkClick('dribbble')}>Dribbble</a>
          </div>
        
          <a href={`mailto:${emailAddress}`} className="footer-link email-link">
                        <button type="button" className="icon-button" onClick={handleCopyEmail} aria-label="Copy email" title="Copy email">
                          <svg
                            className="copy-icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16 1H4C2.895 1 2 1.895 2 3V17H4V3H16V1Z" fill="currentColor"/>
                            <path d="M19 5H8C6.895 5 6 5.895 6 7V21C6 22.105 6.895 23 8 23H19C20.105 23 21 22.105 21 21V7C21 5.895 20.105 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                          </svg>
                        </button>
                        {emailAddress}
                      </a>
        </div>
      </div>

      {/* Toast Notification */}
      {showCopyMessage && (
        <div className="copy-message">
          Email copied!
        </div>
      )}

      {/* Password Modal */}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default PortfolioPage; 
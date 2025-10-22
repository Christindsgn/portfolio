// Analytics configuration
import posthog from 'posthog-js';

export const GA_MEASUREMENT_ID = 'G-DN1HPH2R16'; // Replace with your actual Google Analytics ID

// Initialize both Google Analytics and PostHog
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Initialize Google Analytics
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
    
    // Initialize PostHog (it's already initialized by PostHogProvider in main.tsx)
    // But we can ensure it's ready for tracking
    if (posthog.__loaded) {
      posthog.identify();
      console.log('PostHog initialized successfully');
    } else {
      console.log('PostHog not loaded yet');
    }
  }
};

// Track page views (Google Analytics + PostHog)
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
    posthog.capture('$pageview', {
      path: url,
    });
  }
};

// Track custom events (Google Analytics + PostHog)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  const gaParams: Record<string, any> = {
    event_category: category,
  };
  if (label) gaParams.event_label = label;
  if (value !== undefined) gaParams.value = value;

  const posthogParams: Record<string, any> = {
    category: category,
  };
  if (label) posthogParams.label = label;
  if (value !== undefined) posthogParams.value = value;

  if (typeof window !== 'undefined') {
    // Track with Google Analytics
    if (window.gtag) {
      window.gtag('event', action, gaParams);
    }
    
    // Track with PostHog
    try {
      if (posthog.__loaded) {
        posthog.capture(action, posthogParams);
        if (import.meta.env.MODE === 'development') {
          console.log('PostHog event captured:', action, posthogParams);
        }
      } else {
        if (import.meta.env.MODE === 'development') {
          console.log('PostHog not loaded, event not captured:', action);
        }
      }
    } catch (error) {
      console.error('PostHog tracking error:', error);
    }
  }
};

// Specific tracking functions for your portfolio
export const trackPortfolioView = () => {
  trackEvent('portfolio_view', 'engagement', 'portfolio_deck_opened');
};

export const trackResumeDownload = () => {
  trackEvent('resume_download', 'engagement', 'resume_pdf_opened');
};

export const trackEmailClick = () => {
  trackEvent('email_click', 'engagement', 'email_link_clicked');
};

export const trackSocialLinkClick = (platform: string) => {
  trackEvent('social_click', 'engagement', `${platform}_link_clicked`);
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
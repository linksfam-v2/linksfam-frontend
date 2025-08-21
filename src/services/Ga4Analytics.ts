import ReactGA from 'react-ga4'

// Helper function to check if we're on localhost (development server)
const isProduction = () => {
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
}

// Basic event tracking
export const trackEvent = (category: string, action: string, label?: string) => {
  if (!isProduction()) return;
  
  ReactGA.event({
    category,
    action,
    label,
  })
}

// Enhanced event tracking with custom parameters
export const trackEventWithParams = (eventName: string, parameters: Record<string, any>) => {
  if (!isProduction()) return;
  
  ReactGA.event(eventName, parameters)
}

// Track user authentication events
export const trackAuth = (method: 'phone' | 'email' | 'google', action: 'attempt' | 'success' | 'failure', additionalParams?: Record<string, any>) => {
  if (!isProduction()) return;
  
  ReactGA.event('login', {
    method,
    success: action === 'success',
    ...additionalParams
  })
}

// Track page views manually if needed
export const trackPageView = (path: string, title?: string) => {
  if (!isProduction()) return;
  
  ReactGA.send({ 
    hitType: 'pageview', 
    page: path,
    title: title || document.title
  })
}

// Track conversion events
export const trackConversion = (eventName: string, value?: number, currency?: string) => {
  if (!isProduction()) return;
  
  ReactGA.event(eventName, {
    value,
    currency: currency || 'USD'
  })
}

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (!isProduction()) return;
  
  ReactGA.set(properties)
}

// Track custom events
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!isProduction()) return;
  
  ReactGA.event(eventName, parameters)
}

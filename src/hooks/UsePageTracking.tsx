import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    // Only track pageviews when not on localhost (development server)
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location])
}

export default usePageTracking
import RoutePath from './routes/Routes';
import ReactGA from 'react-ga4';
import usePageTracking from './hooks/UsePageTracking';

function App() {
  // Only initialize GA4 when not on localhost (development server)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    ReactGA.initialize('G-2RG24WQL2Z');
  }
  
  usePageTracking();
  return (
    <div >
      <RoutePath />
    </div>
  );
}

export default App;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import mixpanel from 'mixpanel-browser';

const queryClient = new QueryClient();

mixpanel.init('4360813eefae6fad425d8b07c5d5e500');

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='672912010551-2j3ruvmru1rb14ibuupntl6gb95b7e6k.apps.googleusercontent.com'>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StrictMode>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className=""
            bodyClassName={'toast'}
            icon={<FaInfoCircle />}
          />
        </StrictMode>
      </BrowserRouter>
    </QueryClientProvider>
  </GoogleOAuthProvider>,
)

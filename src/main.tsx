import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider } from 'posthog-js/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY || 'phc_TqQrXZ1n4v1wbnYgu1dMjlZjGQe3Z04a4F0ZWWEKimG'}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_exceptions: true,
        debug: import.meta.env.MODE === 'development',
        loaded: (posthog) => {
          if (import.meta.env.MODE === 'development') {
            console.log('PostHog loaded in development mode');
          }
        },
        // Ensure CORS is handled properly
        cross_subdomain_cookie: false,
        secure_cookie: import.meta.env.MODE === 'production',
      }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import './index.css'

if (!window.location.href.includes("localhost")) {
  Sentry.init({
    dsn: "https://6ac2b03532a6c81ff8b8ddf76f92a862@o4507575594713088.ingest.us.sentry.io/4507575608475648",
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/app\.mp2\.in/],
  });
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="394159506264-2ua1tunsun8aptmv66evo4k14fk06qhe.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
)

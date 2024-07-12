import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
// import * as Sentry from "@sentry/react";
// import './index.css'

// Sentry.init({
//   dsn: "https://6ac2b03532a6c81ff8b8ddf76f92a862@o4507575594713088.ingest.us.sentry.io/4507575608475648",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: [/^https:\/\/app\.mp2\.in/],
//   // Session Replay
//   replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
// import './index.css'

Sentry.init({
  dsn: "https://4551ed53e6c2b72b13b9132c64393205@o4507575594713088.ingest.us.sentry.io/4507575596810240",
  integrations: [],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

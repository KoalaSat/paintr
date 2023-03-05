/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import * as React from 'react'
import ReactDOM from 'react-dom/client'

// Use consistent styling
import 'sanitize.css/sanitize.css'

// Import root app
import { App } from 'app'

import { HelmetProvider } from 'react-helmet-async'

import reportWebVitals from 'reportWebVitals'

// Initialize languages
import './locales/i18n'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <HelmetProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HelmetProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

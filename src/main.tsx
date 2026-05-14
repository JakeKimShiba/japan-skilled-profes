import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { I18nProvider } from '@/i18n'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

import { initAnalytics } from '@/lib/analytics'

// GitHub Pages SPA redirect: restore path from 404.html redirect
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
if (redirectPath) {
  window.history.replaceState(null, '', redirectPath);
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

// Initialize analytics after the app mounts
initAnalytics()

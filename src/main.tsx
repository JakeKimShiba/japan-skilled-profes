import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { I18nProvider } from '@/i18n'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

import { initAnalytics } from '@/lib/analytics'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <I18nProvider>
      <App />
    </I18nProvider>
  </ErrorBoundary>
)

// Initialize analytics after the app mounts
initAnalytics()

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DocsLayout } from './docs/DocsLayout'
import { Introduction } from './docs/Introduction'
import { GettingStarted } from './docs/GettingStarted'
import { ConditionalBranching } from './docs/ConditionalBranching'
import { Validation } from './docs/Validation'
import { Persistence } from './docs/Persistence'
import { APIReference } from './docs/APIReference'
import { JobApplicationForm } from './demo/JobApplicationForm'

const IS_DOCS_DOMAIN = window.location.hostname === 'docs.formtrek.dev'

const docsRoutes = (
  <>
    <Route index element={<Navigate to="introduction" replace />} />
    <Route path="introduction" element={<Introduction />} />
    <Route path="getting-started" element={<GettingStarted />} />
    <Route path="conditional-branching" element={<ConditionalBranching />} />
    <Route path="validation" element={<Validation />} />
    <Route path="persistence" element={<Persistence />} />
    <Route path="api" element={<APIReference />} />
  </>
)

export function App() {
  if (IS_DOCS_DOMAIN) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DocsLayout />}>
            {docsRoutes}
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<JobApplicationForm />} />
        <Route path="/docs" element={<DocsLayout />}>
          {docsRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

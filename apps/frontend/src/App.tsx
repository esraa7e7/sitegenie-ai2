import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })));
const DashboardView = lazy(() => import('./components/DashboardView').then(module => ({ default: module.DashboardView })));
const EditorView = lazy(() => import('./components/EditorView').then(module => ({ default: module.EditorView })));
const AuthPage = lazy(() => import('./components/AuthPage'));

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Router>
        <Navbar />
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardView />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/editor/:projectId?" 
                element={
                  <ProtectedRoute>
                    <EditorView />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<AuthPage />} />
              {/* Catch-all route for SPA fallback on Vercel */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
      <Toaster richColors />
    </div>
  );
}

export default App;

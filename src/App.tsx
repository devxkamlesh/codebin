import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewSnippet from './pages/NewSnippet';
import EditSnippet from './pages/EditSnippet';
import ViewSnippet from './pages/ViewSnippet';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import ProfileView from './pages/ProfileView';
import NotFound from './pages/NotFound';
import './App.css';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

// Layout component for app pages (with sidebar)
function AppLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Layout for landing pages (without sidebar)
function LandingLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <LandingNavbar />
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing pages with LandingLayout */}
          <Route path="/" element={
            <LandingLayout>
              <Home />
            </LandingLayout>
          } />
          
          <Route path="/login" element={
            <LandingLayout>
              <Login />
            </LandingLayout>
          } />
          
          {/* Public view snippet page with LandingLayout */}
          <Route path="/view/:id" element={
            <LandingLayout>
              <ViewSnippet />
            </LandingLayout>
          } />
          
          <Route path="/explore" element={
            <LandingLayout>
              <Explore />
            </LandingLayout>
          } />
          
          <Route path="/user/:userId" element={
            <LandingLayout>
              <ProfileView />
            </LandingLayout>
          } />
          
          {/* App pages with AppLayout and ProtectedRoute */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/new" element={
            <ProtectedRoute>
              <AppLayout>
                <NewSnippet />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <EditSnippet />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* 404 page */}
          <Route path="*" element={
            <LandingLayout>
              <NotFound />
            </LandingLayout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

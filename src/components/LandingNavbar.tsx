import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Code, Menu, X, LogOut, Home, Globe } from 'lucide-react';

export default function LandingNavbar() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-md p-1">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">CodeBin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-sm font-medium ${isActive('/explore') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Explore
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        className="h-8 w-8 rounded-full" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {currentUser.displayName?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-gray-200"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              to="/explore"
              className="flex items-center gap-2 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Globe className="h-5 w-5" />
              Explore
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        className="h-8 w-8 rounded-full" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {currentUser.displayName?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
} 
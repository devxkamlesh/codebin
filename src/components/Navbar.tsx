import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import {
  Code,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Home,
  Plus,
  LayoutDashboard,
  HelpCircle,
  UserCircle,
  Globe
} from 'lucide-react';

// Define the type for expanded categories state
interface ExpandedCategories {
  navigation: boolean;
  snippets: boolean;
  account: boolean;
}

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({
    navigation: true,
    snippets: true,
    account: true
  });
  const location = useLocation();

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const toggleCategory = (category: keyof ExpandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Toggle Button (Fixed) */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 flex items-center justify-center rounded-full p-2 bg-white shadow-md text-muted-foreground"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar/Slider Menu */}
      <div className="relative z-40">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <motion.aside
          className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="flex flex-col h-full p-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 py-4 mb-6 border-b">
              <div className="bg-primary rounded-md p-1">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">CodeBin</span>
            </Link>

            {currentUser ? (
              <>
                <div className="flex items-center gap-2 mb-6 p-2 border-b pb-4">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {currentUser.displayName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {currentUser.displayName || currentUser.email || 'User'}
                    </span>
                    <Link
                      to="/profile"
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  {/* Navigation Category */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleCategory('navigation')}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <span>Navigation</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.navigation ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedCategories.navigation && (
                      <div className="space-y-1 pl-1">
                        <Link
                          to="/"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Link>

                        <Link
                          to="/explore"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/explore') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <Globe className="h-5 w-5" />
                          <span>Explore</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Snippets Category */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleCategory('snippets')}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <span>Snippets</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.snippets ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedCategories.snippets && (
                      <div className="space-y-1 pl-1">
                        <Link
                          to="/dashboard"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>My Snippets</span>
                        </Link>

                        <Link
                          to="/new"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/new') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <Plus className="h-5 w-5" />
                          <span>Create New Snippet</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Account Category */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleCategory('account')}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <span>Account</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.account ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedCategories.account && (
                      <div className="space-y-1 pl-1">
                        <Link
                          to="/profile"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/profile') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>My Profile</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <div className="mb-4">
                    <button
                      onClick={toggleHelp}
                      className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium w-full text-left hover:bg-gray-100"
                    >
                      <HelpCircle className="h-5 w-5" />
                      <span>Help & Information</span>
                      <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showHelp ? 'rotate-180' : ''}`} />
                    </button>

                    {showHelp && (
                      <div className="mt-2 bg-gray-50 rounded-md p-3 text-left">
                        <h3 className="font-medium text-gray-900 mb-2 text-sm">Quick Help</h3>
                        <ul className="space-y-2 text-xs text-gray-600">
                          <li className="flex items-start gap-2">
                            <Home className="h-3.5 w-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span><strong>Home:</strong> Return to the landing page</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <UserCircle className="h-3.5 w-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span><strong>My Profile:</strong> View and edit your profile</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="h-3.5 w-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span><strong>Explore:</strong> Discover public snippets</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <LayoutDashboard className="h-3.5 w-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span><strong>My Snippets:</strong> View all your saved code snippets</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Plus className="h-3.5 w-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span><strong>Create New:</strong> Add a new code snippet</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 w-full justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 space-y-4">
                  {/* Navigation Category */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleCategory('navigation')}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <span>Navigation</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedCategories.navigation ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedCategories.navigation && (
                      <div className="space-y-1 pl-1">
                        <Link
                          to="/"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Link>

                        <Link
                          to="/explore"
                          className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium ${isActive('/explore') ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        >
                          <Globe className="h-5 w-5" />
                          <span>Explore</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.aside>
      </div>
    </>
  );
} 
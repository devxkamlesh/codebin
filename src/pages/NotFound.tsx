import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-red-50 rounded-full p-6 mb-6">
        <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Please check the URL or navigate back to the home page.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="h-5 w-5" />
          Go to Home Page
        </Link>
        
        <button 
          onClick={() => window.history.back()} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  );
} 
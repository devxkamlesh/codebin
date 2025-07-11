import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function ExploreHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <Globe className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Snippets</h1>
          <p className="text-sm text-gray-500">Discover public code snippets from the community</p>
        </div>
      </div>
      <Link 
        to="/new" 
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create Snippet
      </Link>
    </div>
  );
} 
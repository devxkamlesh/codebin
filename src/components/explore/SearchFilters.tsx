import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

// Available languages and categories for filtering
const languages = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 
  'csharp', 'go', 'ruby', 'php', 'html', 'css', 'sql', 'bash', 'plaintext'
];

const categories = [
  'Frontend', 'Backend', 'DevOps', 'Database', 
  'Algorithm', 'Utility', 'Configuration', 'Testing', 'Other'
];

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedLanguage,
  setSelectedLanguage,
  selectedCategory,
  setSelectedCategory
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('');
    setSelectedCategory('');
  };

  const hasActiveFilters = searchQuery || selectedLanguage || selectedCategory;

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search snippets by title, description or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle and clear buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-3">
            {searchQuery && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <span>Search: {searchQuery}</span>
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedLanguage && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <span>Language: {selectedLanguage}</span>
                <button onClick={() => setSelectedLanguage('')}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('')}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
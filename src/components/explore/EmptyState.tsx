import { Link } from 'react-router-dom';

interface EmptyStateProps {
  hasSnippets: boolean;
  clearFilters?: () => void;
}

export default function EmptyState({ hasSnippets, clearFilters }: EmptyStateProps) {
  // No snippets at all
  if (!hasSnippets) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No snippets found</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          It looks like there aren't any public code snippets available yet.
          Be the first to share your code with the community!
        </p>
        <Link
          to="/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create a Snippet
        </Link>
      </div>
    );
  }

  // Has snippets but none match the current filters
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No matching snippets</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        We couldn't find any snippets matching your current filters.
        Try adjusting your search criteria or clear all filters.
      </p>
      {clearFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
} 
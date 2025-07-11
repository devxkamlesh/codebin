import SnippetCard from './SnippetCard';
import EmptyState from './EmptyState';
import type { Snippet } from '../../types/snippet';

interface SnippetGridProps {
  snippets: Snippet[];
  loading: boolean;
  clearFilters?: () => void;
}

export default function SnippetGrid({ snippets, loading, clearFilters }: SnippetGridProps) {
  // Show skeleton loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state if no snippets
  if (snippets.length === 0) {
    return <EmptyState hasSnippets={false} clearFilters={clearFilters} />;
  }

  // Show grid of snippets
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          id={snippet.id}
          title={snippet.title}
          description={snippet.description || ''}
          language={snippet.language}
          category={snippet.category}
          tags={snippet.tags}
          authorName={snippet.authorName || 'Anonymous'}
          authorId={snippet.authorId}
          createdAt={snippet.createdAt}
        />
      ))}
    </div>
  );
} 
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface SnippetCardProps {
  id: string;
  title: string;
  description: string;
  language: string;
  category?: string;
  tags?: string[];
  authorName: string;
  authorId?: string;
  createdAt: any;
}

export default function SnippetCard({
  id,
  title,
  description,
  language,
  category,
  tags,
  authorName,
  authorId,
  createdAt
}: SnippetCardProps) {
  // Format the creation date
  const formattedDate = createdAt ? 
    formatDistanceToNow(new Date(createdAt.seconds * 1000), { addSuffix: true }) : 
    'Unknown date';

  // Get language color based on language name
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-100 text-yellow-800',
      typescript: 'bg-blue-100 text-blue-800',
      python: 'bg-green-100 text-green-800',
      java: 'bg-orange-100 text-orange-800',
      csharp: 'bg-purple-100 text-purple-800',
      c: 'bg-gray-100 text-gray-800',
      cpp: 'bg-indigo-100 text-indigo-800',
      php: 'bg-pink-100 text-pink-800',
      ruby: 'bg-red-100 text-red-800',
      go: 'bg-cyan-100 text-cyan-800',
      rust: 'bg-amber-100 text-amber-800',
      swift: 'bg-orange-100 text-orange-800',
      kotlin: 'bg-purple-100 text-purple-800',
      html: 'bg-red-100 text-red-800',
      css: 'bg-blue-100 text-blue-800',
      sql: 'bg-green-100 text-green-800'
    };

    return colors[lang.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLanguageColor(language)}`}>
            {language}
          </span>
          {category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {category}
            </span>
          )}
        </div>
        
        <Link to={`/view/${id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block text-gray-500 text-xs px-1 py-1">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            {authorId ? (
              <Link to={`/user/${authorId}`} className="hover:text-blue-600 transition-colors">
                {authorName}
              </Link>
            ) : (
              <span>{authorName}</span>
            )}
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
} 
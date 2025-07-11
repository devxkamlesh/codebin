import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Tag, Clock, User, Copy, Check, Lock, Globe, Play, ChevronUp } from 'lucide-react';
import CodeRunner, { SUPPORTED_LANGUAGES } from '../components/CodeRunner';

interface Snippet {
  title: string;
  description?: string;
  language: string;
  content: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | null;
}

export default function ViewSnippet() {
  const { id } = useParams<{ id: string }>();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCodeRunner, setShowCodeRunner] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchSnippet() {
      try {
        if (!id) {
          setError('Snippet ID not found');
          setLoading(false);
          return;
        }

        console.log("Fetching snippet with ID:", id);
        const snippetRef = doc(db, 'snippets', id);
        const snippetDoc = await getDoc(snippetRef);
        
        if (!snippetDoc.exists()) {
          console.log("Snippet not found");
          setError('Snippet not found');
          setLoading(false);
          return;
        }
        
        const snippetData = snippetDoc.data();
        console.log("Snippet data:", snippetData);
        
        // Check permissions for private snippets
        if (!snippetData.isPublic && snippetData.authorId !== currentUser?.uid) {
          setError('This snippet is private. You do not have permission to view it.');
          setLoading(false);
          return;
        }
        
        // Handle both code and content fields for backward compatibility
        const snippetContent = snippetData.content || snippetData.code;
        
        // Validate required fields
        if (!snippetContent) {
          console.error("Snippet is missing content/code field");
          setError('Invalid snippet data');
          setLoading(false);
          return;
        }
        
        setSnippet({
          title: snippetData.title || 'Untitled Snippet',
          description: snippetData.description || '',
          language: snippetData.language || 'plaintext',
          content: snippetContent,
          category: snippetData.category || '',
          tags: snippetData.tags || [],
          isPublic: snippetData.isPublic || false,
          authorId: snippetData.authorId,
          authorName: snippetData.authorName || 'Anonymous',
          createdAt: snippetData.createdAt || null
        });
      } catch (error) {
        console.error("Error fetching snippet:", error);
        setError('Failed to load snippet. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSnippet();
  }, [id, currentUser]);

  const handleCopyCode = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      
      // Reset "Copied" status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const toggleCodeRunner = () => {
    setShowCodeRunner(!showCodeRunner);
  };

  const isLanguageSupported = snippet && SUPPORTED_LANGUAGES.includes(snippet.language.toLowerCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <p className="font-medium text-lg mb-4">{error}</p>
          <Link to="/" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6">
          <p className="font-medium text-lg mb-4">Snippet not found</p>
          <Link to="/" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.uid === snippet.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{snippet.title}</h1>
            <div className="flex items-center gap-2" title={snippet.isPublic ? "Public snippet" : "Private snippet"}>
              {snippet.isPublic ? (
                <>
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Public</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Private</span>
                </>
              )}
            </div>
          </div>
          
          {snippet.description && (
            <p className="text-gray-600 mb-4">
              {snippet.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1.5 text-gray-500" />
              {snippet.authorName || 'Anonymous'}
              {isOwner && <span className="ml-1 text-xs text-blue-600">(You)</span>}
            </div>
            
            {snippet.createdAt && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                {new Date(snippet.createdAt.toDate()).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {snippet.language}
            </span>
            
            {snippet.category && (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                {snippet.category}
              </span>
            )}
          </div>
          
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <Tag className="h-3.5 w-3.5 text-gray-500" />
              {snippet.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{snippet.language}</span>
            <div className="flex items-center gap-2">
              {isLanguageSupported ? (
                <button 
                  onClick={toggleCodeRunner}
                  className={`inline-flex items-center px-3 py-1.5 ${showCodeRunner ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white border-gray-200'} border rounded text-sm hover:bg-gray-50 transition-colors`}
                >
                  {showCodeRunner ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1.5 text-blue-500" />
                      Hide Runner
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1.5 text-blue-500" />
                      Run Code
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs text-amber-600 max-w-[250px]">
                  Running {snippet.language} code is not supported. Supported languages: {SUPPORTED_LANGUAGES.join(', ')}.
                </span>
              )}
              <button 
                onClick={handleCopyCode}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5 text-gray-500" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto bg-gray-50 text-sm font-mono">
            <code>{snippet.content}</code>
          </pre>
        </div>
        
        {isLanguageSupported && (
          <div className={`border-t border-gray-200 transition-all duration-300 ${showCodeRunner ? 'max-h-[2000px]' : 'max-h-0 overflow-hidden'}`}>
            <div className={`p-4 bg-gray-50 ${showCodeRunner ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <CodeRunner code={snippet.content} language={snippet.language} />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between">
        <Link 
          to="/dashboard" 
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </Link>
        
        {isOwner && (
          <Link 
            to={`/edit/${id}`}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Snippet
          </Link>
        )}
      </div>
    </div>
  );
} 
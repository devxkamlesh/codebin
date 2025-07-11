import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, Timestamp, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Plus, Code, Tag as TagIcon, Edit, Trash2, AlertCircle, ExternalLink, Lock, Globe, Search, Filter } from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt: Timestamp | null;
}

export default function Dashboard() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Available languages and categories for filtering
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 
    'csharp', 'go', 'ruby', 'php', 'html', 'css', 'sql', 'bash', 'plaintext'
  ];
  
  const categories = [
    'Frontend', 'Backend', 'DevOps', 'Database', 
    'Algorithm', 'Utility', 'Configuration', 'Testing', 'Other'
  ];

  useEffect(() => {
    async function fetchSnippets() {
      try {
        if (!currentUser) {
          console.log("No current user");
          setLoading(false);
          return;
        }

        console.log("Fetching snippets for user:", currentUser.uid);
        
        // First try with both where and orderBy
        try {
          const snippetsQuery = query(
            collection(db, 'snippets'),
            where('authorId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(50)
          );
          
          const querySnapshot = await getDocs(snippetsQuery);
          console.log("Query snapshot with orderBy:", querySnapshot.size, "documents");
          
          const snippetsList: Snippet[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Snippet data:", doc.id, data);
            
            snippetsList.push({
              id: doc.id,
              title: data.title || 'Untitled',
              description: data.description || '',
              language: data.language || 'plaintext',
              category: data.category || '',
              tags: data.tags || [],
              isPublic: data.isPublic || false,
              createdAt: data.createdAt || null
            });
          });
          
          console.log("Snippets list:", snippetsList);
          setSnippets(snippetsList);
        } catch (indexError) {
          console.error("Error with ordered query (likely missing index):", indexError);
          
          // Fallback to just the where clause without ordering
          const simpleQuery = query(
            collection(db, 'snippets'),
            where('authorId', '==', currentUser.uid),
            limit(50)
          );
          
          const simpleSnapshot = await getDocs(simpleQuery);
          console.log("Simple query snapshot:", simpleSnapshot.size, "documents");
          
          const simpleList: Snippet[] = [];
          
          simpleSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Simple snippet data:", doc.id, data);
            
            simpleList.push({
              id: doc.id,
              title: data.title || 'Untitled',
              description: data.description || '',
              language: data.language || 'plaintext',
              category: data.category || '',
              tags: data.tags || [],
              isPublic: data.isPublic || false,
              createdAt: data.createdAt || null
            });
          });
          
          console.log("Simple snippets list:", simpleList);
          setSnippets(simpleList);
        }
      } catch (error) {
        console.error("Error fetching snippets:", error);
        setError('Failed to load your snippets. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSnippets();
  }, [currentUser]);

  // Filter snippets based on search query and filters
  const filteredSnippets = snippets.filter(snippet => {
    // Filter by search query
    const matchesQuery = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (snippet.tags && snippet.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Filter by language
    const matchesLanguage = selectedLanguage === '' || 
      snippet.language.toLowerCase() === selectedLanguage.toLowerCase();
    
    // Filter by category
    const matchesCategory = selectedCategory === '' || 
      snippet.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesQuery && matchesLanguage && matchesCategory;
  });

  const handleViewClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/view/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/edit/${id}`);
  };

  const showDeleteConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirm(id);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm(null);
  };

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'snippets', id));
      setSnippets(snippets.filter(snippet => snippet.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting snippet:", error);
      alert("Failed to delete snippet. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // setActiveMenu(null); // This line is removed
      setDeleteConfirm(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mx-auto max-w-2xl mt-8">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Snippets</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
            title={showFilters ? "Hide filters" : "Show filters"}
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? "Hide Filters" : "Filter"}
          </button>
          <Link 
            to="/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Snippet
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      {showFilters && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search snippets by title, description or tags"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </div>
      )}
      
      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg text-center">
          <Code className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No snippets yet</h3>
          <p className="text-gray-500 mb-6">Create your first code snippet to get started</p>
          <Link 
            to="/new" 
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Snippet
          </Link>
        </div>
      ) : (
        <>
          {showFilters && filteredSnippets.length > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              Showing {filteredSnippets.length} of {snippets.length} snippets
            </p>
          )}
          
          {filteredSnippets.length === 0 && showFilters ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg text-center">
              <Code className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No matching snippets</h3>
              <p className="text-gray-500 mb-6">Try changing your search filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('');
                  setSelectedCategory('');
                }} 
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSnippets.map((snippet) => (
                <div 
                  key={snippet.id} 
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden relative"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{snippet.title}</h3>
                        <div className="flex items-center" title={snippet.isPublic ? "Public snippet" : "Private snippet"}>
                          {snippet.isPublic ? (
                            <Globe className="h-4 w-4 text-green-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {snippet.language}
                        </span>
                        {snippet.category && (
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            {snippet.category}
                          </span>
                        )}
                        
                        {/* Menu button - moved outside the badges */}
                      </div>
                    </div>
                    
                    {snippet.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {snippet.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                        {snippet.tags && snippet.tags.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <TagIcon className="h-3.5 w-3.5 text-gray-500" />
                            {snippet.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {snippet.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{snippet.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {snippet.createdAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(snippet.createdAt.toDate()).toLocaleDateString()}
                          </span>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center">
                          <button
                            onClick={(e) => handleViewClick(e, snippet.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="View snippet"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={(e) => handleEditClick(e, snippet.id)}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
                            title="Edit snippet"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={(e) => showDeleteConfirm(e, snippet.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete snippet"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete confirmation overlay */}
                  {deleteConfirm === snippet.id && (
                    <div 
                      className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center p-4 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Delete this snippet?</h4>
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={cancelDelete}
                          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
                          disabled={deleting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, snippet.id)}
                          className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 
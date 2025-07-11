import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Snippet } from '../types/snippet';
import ExploreHeader from '../components/explore/ExploreHeader';
import SearchFilters from '../components/explore/SearchFilters';
import SnippetGrid from '../components/explore/SnippetGrid';
import { Helmet } from 'react-helmet';

export default function Explore() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);

  // Fetch public snippets
  useEffect(() => {
    async function fetchPublicSnippets() {
        setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching public snippets...");
        const snippetsRef = collection(db, 'snippets');
        
        // Try to get snippets without the orderBy constraint first
        // This helps if some documents are missing the createdAt field
        let q = query(
          snippetsRef,
            where('isPublic', '==', true),
          limit(100)
        );
        
        let querySnapshot = await getDocs(q);
        console.log("Query executed, document count:", querySnapshot.size);
        
        const fetchedSnippets: Snippet[] = [];
        
        // Process the documents
        querySnapshot.forEach((doc) => {
          try {
          const data = doc.data();
          
            // Create a default timestamp if createdAt is missing
            const createdAt = data.createdAt || Timestamp.now();
            
            fetchedSnippets.push({
            id: doc.id,
              title: data.title || 'Untitled Snippet',
            description: data.description || '',
              code: data.code || '',
            language: data.language || 'plaintext',
            category: data.category || '',
              tags: Array.isArray(data.tags) ? data.tags : [],
              isPublic: data.isPublic === false ? false : true,
              authorId: data.authorId || '',
            authorName: data.authorName || 'Anonymous',
              createdAt: createdAt,
              updatedAt: data.updatedAt || createdAt,
              viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
              likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
              forkCount: typeof data.forkCount === 'number' ? data.forkCount : 0
            });
          } catch (docError) {
            console.error('Error processing document:', doc.id, docError);
            // Continue with next document instead of failing the entire query
          }
        });
        
        // Sort the snippets by createdAt manually since we couldn't use orderBy in the query
        fetchedSnippets.sort((a, b) => {
          const timeA = a.createdAt instanceof Timestamp ? a.createdAt.seconds : (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const timeB = b.createdAt instanceof Timestamp ? b.createdAt.seconds : (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return timeB - timeA; // Descending order (newest first)
        });
        
        console.log("Fetched and sorted snippets:", fetchedSnippets);
        setSnippets(fetchedSnippets);
    } catch (error) {
        console.error('Error fetching public snippets:', error);
        setError('Failed to load snippets. Please try again later.');
    } finally {
      setLoading(false);
      }
    }

    fetchPublicSnippets();
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    try {
      const filtered = snippets.filter(snippet => {
    // Filter by search query
        const matchesSearch = searchQuery === '' || 
          (snippet.title && snippet.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (snippet.description && snippet.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (snippet.tags && Array.isArray(snippet.tags) && snippet.tags.some(tag => 
            tag && tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Filter by language
    const matchesLanguage = selectedLanguage === '' || 
          (snippet.language && snippet.language.toLowerCase() === selectedLanguage.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === '' || 
          (snippet.category && snippet.category.toLowerCase() === selectedCategory.toLowerCase());
        
        return matchesSearch && matchesLanguage && matchesCategory;
      });
      
      console.log("Filtered snippets:", filtered);
      setFilteredSnippets(filtered);
    } catch (filterError) {
      console.error('Error filtering snippets:', filterError);
      // If filtering fails, just show all snippets
      setFilteredSnippets(snippets);
    }
  }, [snippets, searchQuery, selectedLanguage, selectedCategory]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('');
    setSelectedCategory('');
  };

  // Retry loading snippets
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Force re-fetch by triggering the useEffect
    setSnippets([]);
    // Wait a bit then reload the page
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Explore Code Snippets | CodeBin</title>
        <meta name="description" content="Discover and share code snippets with the developer community" />
      </Helmet>
      
      <ExploreHeader />
      
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {/* Show error message if there is one */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p>{error}</p>
          <button 
            onClick={handleRetry} 
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Show filtered results count */}
      {!loading && !error && filteredSnippets.length > 0 && (
        <div className="mb-6 text-sm text-gray-500">
          Showing {filteredSnippets.length} {filteredSnippets.length === 1 ? 'snippet' : 'snippets'}
          {(searchQuery || selectedLanguage || selectedCategory) && ' matching your filters'}
                        </div>
                      )}
                      
      {/* Display snippets or empty state */}
      {!error && (
        filteredSnippets.length === 0 && !loading && snippets.length > 0 ? (
          <div className="mt-8">
            <SnippetGrid 
              snippets={[]} 
              loading={loading} 
              clearFilters={clearFilters} 
            />
                  </div>
                ) : (
          <div className="mt-8">
            <SnippetGrid 
              snippets={filteredSnippets} 
              loading={loading}
              clearFilters={clearFilters}
            />
            </div>
        )
      )}
    </div>
  );
} 
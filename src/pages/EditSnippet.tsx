import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Loader2, Save, Trash2, X } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';

export default function EditSnippet() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Fetch snippet data
  useEffect(() => {
    const fetchSnippet = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const snippetDoc = await getDoc(doc(db, 'snippets', id));
        
        if (!snippetDoc.exists()) {
          setError('Snippet not found');
          return;
        }
        
        const snippetData = snippetDoc.data();
        
        // Check if user is authorized to edit
        if (snippetData.authorId !== currentUser?.uid) {
          setError('You do not have permission to edit this snippet');
          return;
        }
        
        // Set form data
        setTitle(snippetData.title || '');
        setDescription(snippetData.description || '');
        setCode(snippetData.code || '');
        setLanguage(snippetData.language || 'javascript');
        setCategory(snippetData.category || '');
        setTags(snippetData.tags || []);
        setIsPublic(snippetData.isPublic !== false);
      } catch (err) {
        console.error('Error fetching snippet:', err);
        setError('Failed to load snippet data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSnippet();
  }, [id, currentUser]);

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !code) {
      setError('Title and code are required');
      return;
    }
    
    if (!currentUser || !id) {
      setError('You must be logged in to update a snippet');
      return;
    }
    
      setSaving(true);
      setError('');
      
    try {
      // Update snippet document in Firestore
      const snippetRef = doc(db, 'snippets', id);
      
      // Use serverTimestamp to ensure consistent timestamp across devices
      await updateDoc(snippetRef, {
        title,
        description,
        code,
        language,
        category: category || null,
        tags: tags.length > 0 ? tags : [],
        isPublic,
        updatedAt: serverTimestamp()
      });
      
      console.log('Snippet updated successfully');
      
      // Navigate back to view the updated snippet
      navigate(`/view/${id}`);
    } catch (err) {
      console.error('Error updating snippet:', err);
      setError('Failed to update snippet. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle snippet deletion
  const handleDelete = async () => {
    if (!currentUser || !id) {
      setError('You must be logged in to delete a snippet');
      return;
    }
    
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setDeleting(true);
    setError('');
    
    try {
      // Delete snippet document from Firestore
      await deleteDoc(doc(db, 'snippets', id));
      
      console.log('Snippet deleted successfully');
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting snippet:', err);
      setError('Failed to delete snippet. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-600">
          <p className="mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Snippet</h1>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={deleting || saving}
        >
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : deleteConfirm ? (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Confirm Delete
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Snippet
            </>
          )}
        </Button>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
            </label>
            <input
            id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Give your snippet a title"
              required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Briefly describe what this code does"
          />
        </div>
        
        {/* Language Selector */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="rust">Rust</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
            <option value="shell">Shell/Bash</option>
            <option value="plaintext">Plain Text</option>
          </select>
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
            <option value="algorithm">Algorithm</option>
            <option value="utility">Utility Function</option>
            <option value="component">UI Component</option>
            <option value="configuration">Configuration</option>
            <option value="api">API Integration</option>
            <option value="database">Database</option>
            <option value="security">Security</option>
            <option value="testing">Testing</option>
            <option value="other">Other</option>
            </select>
          </div>
          
        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (max 5)
            </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
                  <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                  onClick={() => removeTag(tag)} 
                  className="ml-1 text-blue-400 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
          <div className="flex">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={addTag}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add tags (press Enter or comma to add)"
              disabled={tags.length >= 5}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
              disabled={tags.length >= 5 || !tagInput.trim()}
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter tags separated by Enter or comma. Tags help others find your snippet.
          </p>
        </div>
        
        {/* Code Editor */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Code *
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              height="400px"
            />
          </div>
        </div>
        
        {/* Visibility */}
        <div className="flex items-center space-x-2">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
            Make this snippet public
          </label>
          <div className="ml-2 text-xs text-gray-500">
            {isPublic ? 
              "Anyone can view this snippet" : 
              "Only you can view this snippet"
            }
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mr-2"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || !title || !code}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 
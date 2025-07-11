import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Loader2, Github, Twitter, Linkedin, Globe, Lock, ArrowLeft, Code, Calendar } from 'lucide-react';
import type { Snippet } from '../types/snippet';
import SnippetCard from '../components/explore/SnippetCard';
import ContributionGraph from '../components/profile/ContributionGraph';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  website: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  isPublic: boolean;
}

export default function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const [snippetsError, setSnippetsError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Fetch profile data from Firestore
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Create profile with default values for missing fields
          const userProfile: UserProfile = {
            uid: userData.uid || userId,
            displayName: userData.displayName || 'User',
            email: userData.email || '',
            photoURL: userData.photoURL || null,
            bio: userData.bio || '',
            website: userData.website || '',
            githubUrl: userData.githubUrl || '',
            twitterUrl: userData.twitterUrl || '',
            linkedinUrl: userData.linkedinUrl || '',
            isPublic: userData.isPublic === true
          };
          
          setProfile(userProfile);
          
          // After getting profile, setup real-time listener for user's snippets
          setupSnippetsListener(userId);
        } else {
          setError('User profile not found');
          setSnippetsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information');
        setSnippetsLoading(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
    
    // Cleanup function to unsubscribe from listeners when component unmounts
    return () => {
      if (unsubscribeSnippets) {
        unsubscribeSnippets();
      }
    };
  }, [userId]);
  
  // Store the unsubscribe function
  let unsubscribeSnippets: (() => void) | null = null;
  
  // Setup real-time listener for user's snippets
  const setupSnippetsListener = (uid: string) => {
    try {
      setSnippetsLoading(true);
      setSnippetsError('');
      console.log('Setting up real-time listener for snippets of user:', uid);
      
      // Query for public snippets by this user
      const snippetsRef = collection(db, 'snippets');
      const q = query(
        snippetsRef,
        where('authorId', '==', uid),
        where('isPublic', '==', true)
      );
      
      // Set up real-time listener
      unsubscribeSnippets = onSnapshot(
        q,
        (querySnapshot) => {
          console.log('Received real-time update, snippet count:', querySnapshot.size);
          
          const userSnippets: Snippet[] = [];
          
          querySnapshot.forEach((doc) => {
            try {
              const data = doc.data();
              
              // Create a default timestamp if createdAt is missing
              const createdAt = data.createdAt || Timestamp.now();
              
              userSnippets.push({
                id: doc.id,
                title: data.title || 'Untitled Snippet',
                description: data.description || '',
                code: data.code || '',
                language: data.language || 'plaintext',
                category: data.category || '',
                tags: Array.isArray(data.tags) ? data.tags : [],
                isPublic: data.isPublic === false ? false : true,
                authorId: data.authorId || uid,
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
          
          // Sort the snippets by createdAt manually
          userSnippets.sort((a, b) => {
            const timeA = a.createdAt instanceof Timestamp ? a.createdAt.seconds : (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
            const timeB = b.createdAt instanceof Timestamp ? b.createdAt.seconds : (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
            return timeB - timeA; // Descending order (newest first)
          });
          
          setSnippets(userSnippets);
          setSnippetsLoading(false);
        },
        (error) => {
          console.error('Error listening to snippets:', error);
          setSnippetsError('Failed to load snippets for this user.');
          setSnippetsLoading(false);
        }
      );
    } catch (err) {
      console.error('Error setting up snippets listener:', err);
      setSnippetsError('Failed to load snippets for this user.');
      setSnippetsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-600">
          <p className="mb-4">{error || 'Profile not found'}</p>
          <Link to="/explore" className="text-blue-500 hover:underline">
            Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  // If profile is private, show limited information
  if (!profile.isPublic) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link to="/explore" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={profile.displayName || 'User'} 
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md" 
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute bottom-4 right-6">
              <div className="px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-800">
                <Lock className="h-3 w-3" />
                <span>Private Profile</span>
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-6 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {profile.displayName || 'User'}
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                This user has set their profile to private.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/explore" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Explore</span>
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 relative">
          <div className="absolute -bottom-12 left-6">
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt={profile.displayName || 'User'} 
                className="h-24 w-24 rounded-full border-4 border-white shadow-md" 
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-16 px-6 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.displayName || 'User'}
          </h1>
          
          {profile.bio && (
            <p className="text-gray-600 mt-4 mb-6">{profile.bio}</p>
          )}
          
          {/* Social links */}
          {(profile.website || profile.githubUrl || profile.twitterUrl || profile.linkedinUrl) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              
              {profile.githubUrl && (
                <a 
                  href={profile.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
              
              {profile.twitterUrl && (
                <a 
                  href={profile.twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              )}
              
              {profile.linkedinUrl && (
                <a 
                  href={profile.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Contribution Graph Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">Contribution Activity</h2>
        </div>
        
        {snippetsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : snippetsError ? (
          <div className="text-center py-10 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-2">{snippetsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ContributionGraph snippets={snippets} monthsToShow={12} />
        )}
      </div>
      
      {/* User's Public Snippets Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Code className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">Public Snippets</h2>
        </div>
        
        {snippetsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : snippetsError ? (
          <div className="text-center py-10 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-2">{snippetsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        ) : snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                id={snippet.id}
                title={snippet.title}
                description={snippet.description || ''}
                language={snippet.language}
                category={snippet.category}
                tags={snippet.tags}
                authorName={profile.displayName || 'Anonymous'}
                authorId={profile.uid}
                createdAt={snippet.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">No public snippets yet</p>
            <p className="text-gray-500 text-sm">
              This user hasn't shared any public code snippets yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
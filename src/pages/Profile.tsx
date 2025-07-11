import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { User, Save, Loader2, Github, Twitter, Linkedin, Globe, Lock, Unlock } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Set display name from auth user
        setDisplayName(currentUser.displayName || '');
        
        // Fetch additional profile data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || '');
          setWebsite(userData.website || '');
          setIsPublic(userData.isPublic || false);
          setGithubUrl(userData.githubUrl || '');
          setTwitterUrl(userData.twitterUrl || '');
          setLinkedinUrl(userData.linkedinUrl || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      // Update display name in Firebase Auth
      await updateProfile(currentUser, {
        displayName: displayName
      });
      
      // Update additional profile data in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Create user data object
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName,
        bio,
        website,
        isPublic,
        githubUrl,
        twitterUrl,
        linkedinUrl,
        photoURL: currentUser.photoURL || null,
        updatedAt: new Date()
      };
      
      // Use setDoc with merge option to ensure we create the document if it doesn't exist
      await setDoc(userDocRef, userData, { merge: true });
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <p className="text-center text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 relative">
          <div className="absolute -bottom-12 left-6">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={displayName || 'User'} 
                className="h-24 w-24 rounded-full border-4 border-white shadow-md" 
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-6">
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium ${isPublic ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {isPublic ? (
                <>
                  <Unlock className="h-3 w-3" />
                  <span>Public Profile</span>
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  <span>Private Profile</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-6 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {currentUser.displayName || 'User Profile'}
          </h1>
          <p className="text-gray-500 mb-6">{currentUser.email}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your display name"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make my profile public
                </label>
                <div className="ml-2 text-xs text-gray-500">
                  {isPublic ? 
                    "Your profile will be visible to other users" : 
                    "Only your username will be visible to others"
                  }
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Social Links</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add your social media links below. These will only be visible if your profile is public.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Globe className="h-4 w-4" /> Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="githubUrl" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Github className="h-4 w-4" /> GitHub
                    </label>
                    <input
                      id="githubUrl"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twitterUrl" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Twitter className="h-4 w-4" /> Twitter
                    </label>
                    <input
                      id="twitterUrl"
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedinUrl" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </label>
                    <input
                      id="linkedinUrl"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{currentUser.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Account Created</span>
            <span className="font-medium">
              {currentUser.metadata.creationTime ? 
                new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Last Sign In</span>
            <span className="font-medium">
              {currentUser.metadata.lastSignInTime ? 
                new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 
                'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 
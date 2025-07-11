import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Failed to sign in with Google. Please make sure Google authentication is enabled in Firebase console.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to CodeBin</h2>
        <p>Share your code snippets easily</p>
        
        {error && (
          <div className="error-alert">
            <p>{error}</p>
            <p className="error-help">
              Make sure Google Authentication is enabled in your Firebase console.
            </p>
          </div>
        )}
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="google-btn"
        >
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>
      </div>
    </div>
  );
} 
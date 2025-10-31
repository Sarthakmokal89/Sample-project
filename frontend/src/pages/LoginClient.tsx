import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { User } from '../types';
import { LogoIcon, GoogleIcon } from '../components/Icons';
import { login, storeAuthData } from '../utils/authService';

interface LoginProps {
  setUser: (user: User) => void;
}

const LoginClient: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { token, user } = await login(email, password);
      const userWithAvatar: User = {
        ...user,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.email}`
      };
      storeAuthData(token, userWithAvatar);
      setUser(userWithAvatar);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-950 flex flex-col justify-center items-center p-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
                <LogoIcon className="w-16 h-16"/>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Sentily</h1>
                <p className="text-gray-400 mt-2">Welcome back! Please sign in to your account.</p>
            </div>
            
            <div className="bg-violet-900/50 border border-violet-800 rounded-2xl shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500" 
                            required 
                         />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500" 
                            required
                        />
                    </div>
                     {error && <p className="text-sm text-danger-400 text-center">{error}</p>}

                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-violet-600 bg-violet-800 text-violet-600 focus:ring-violet-500"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-violet-400 hover:text-violet-300">Forgot password?</a>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-950 focus:ring-violet-500 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                     <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-violet-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-violet-900/50 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button type="button" className="w-full flex items-center justify-center bg-gray-200/80 text-gray-800 font-semibold py-2.5 px-4 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-950 focus:ring-white transition duration-300">
                        <GoogleIcon className="w-5 h-5 mr-2" />
                        Sign in with Google
                    </button>
                </form>
            </div>
            <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default LoginClient;

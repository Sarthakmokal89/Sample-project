
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, GoogleIcon } from '../components/Icons';

interface SignupProps {
  onLogin: (role: 'client') => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For this mock, signing up immediately logs the user in as a client.
    onLogin('client');
  };

  return (
    <div className="min-h-screen bg-violet-950 flex flex-col justify-center items-center p-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
                <LogoIcon className="w-16 h-16"/>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Create your Account</h1>
                <p className="text-gray-400 mt-2">Join Sentily to analyze your customer feedback.</p>
            </div>
            
            <div className="bg-violet-900/50 border border-violet-800 rounded-2xl shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" id="name" placeholder="Enter your full name" className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input type="email" id="email" placeholder="Enter your email" className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required/>
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input type="password" id="password" placeholder="Create a password" className="block w-full px-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required/>
                    </div>
                    
                    <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-violet-950 focus:ring-violet-500 transition duration-300 shadow-lg">
                        Create Account
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
                        Sign up with Google
                    </button>
                </form>
            </div>
            <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login-client" className="font-medium text-violet-400 hover:text-violet-300">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default Signup;

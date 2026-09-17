import { useState } from 'react';
import { X, Lock, Mail, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';


export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, showToast } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    showToast(isSignUp ? 'Account created successfully! Welcome to TastyBites 🎉' : 'Signed in successfully! Welcome back 👋', 'success');
    setIsAuthModalOpen(false);
  };

  const handleQuickLogin = () => {
    showToast('Signed in as Priya S. (Bengaluru Foodie)', 'success');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14110f] text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-tight text-lg">Tasty<span className="text-amber-500">Bites</span></span>
          </div>

          <h3 className="text-xl font-bold text-white">
            {isSignUp ? 'Create your foodie account' : 'Welcome back, Foodie!'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {isSignUp ? 'Unlock exclusive discounts & track real-time delivery' : 'Sign in to access your saved orders & favorites'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer mt-2"
            >
              {isSignUp ? 'Create Free Account' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚡ One-Click Quick Guest Login</span>
            </button>
          </div>

          {/* Switch tab */}
          <div className="pt-2 text-center text-xs text-neutral-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-600 font-bold hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? 'Sign In' : 'Sign Up for Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

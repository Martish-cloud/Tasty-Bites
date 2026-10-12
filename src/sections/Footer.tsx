import { useState } from 'react';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';


export const Footer: React.FC = () => {
  const {
    setIsMenuModalOpen,
    setIsOffersModalOpen,
    openOrderTracking,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('🎉 Thank you for subscribing! Check your inbox for 20% off.', 'success');
  };

  return (
    <footer id="footer" className="w-full bg-[#0c0b0a] text-neutral-300 pt-12 pb-8 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-neutral-800/80 text-left">
          {/* Col 1: Brand (3.5 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Logo size="md" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              TastyBites is your go-to destination for delicious food, made with love and the freshest ingredients. Because good food brings people together. ❤️
            </p>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsMenuModalOpen(true)}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsOffersModalOpen(true)}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Blog: "Top 10 Secret Spices Behind Our Biryani" coming soon!', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Contact support: help@tastybites.com | +91 98765 43210', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => showToast('TastyBites Help Center: Open 24/7. Instant chat active!', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => openOrderTracking()}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Returns & Refunds Policy: 100% money-back guarantee for quality issues within 1 hour.', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Terms & Conditions: View our standard service terms.', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Privacy Policy: We never share your personal address or payment info.', 'info')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us (1.5 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3">
              Follow Us
            </h4>
            {/* Non-clickable, fully circular official brand icons with elegant hover effects */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              {/* Instagram */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>

              {/* Facebook */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>

              {/* YouTube */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>

              {/* X / Twitter */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>

              {/* Pinterest */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
                </svg>
              </div>

              {/* LinkedIn */}
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-700/60 text-neutral-300 flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20 cursor-default select-none"
                aria-hidden="true"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium tracking-tight">
              #GoodFoodBringsPeopleTogether
            </p>
          </div>

          {/* Col 5: Newsletter & Handwritten Text (2.5 cols) */}
          <div className="lg:col-span-2 relative flex flex-col justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1.5">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-[11px] text-neutral-400 mb-3">
                Get exclusive offers, new menu updates and more.
              </p>

              {/* Form */}
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/80">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Check email for gift code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white text-neutral-900 placeholder-neutral-500 text-xs px-3 py-2 rounded-l-lg border-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-4 py-2 rounded-r-lg transition-colors shrink-0 cursor-pointer shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Handwritten Decorative Quote: Food Connects Us ♡ */}
            <div className="mt-6 text-right pr-2 select-none pointer-events-none">
              <div className="font-script text-2xl sm:text-3xl text-neutral-200 rotate-6 leading-none inline-block">
                <span>Food</span><br />
                <span>Connects</span><br />
                <span className="text-amber-400 font-bold">Us ♡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© 2024 TastyBites. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-red-500 text-sm animate-pulse">❤️</span>
            <span>for Food Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

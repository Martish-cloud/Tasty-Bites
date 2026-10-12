import { useState } from 'react';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';


export const Footer: React.FC = () => {
  const {
    setIsMenuModalOpen,
    setIsOffersModalOpen,
    setIsTrackOrderOpen,
    setIsAdminOpen,
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
                  onClick={() => setIsTrackOrderOpen(true)}
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
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-amber-400 text-amber-500/90 font-medium transition cursor-pointer flex items-center gap-1.5"
                  title="Staff Portal (PIN: 1234)"
                >
                  <span>🔐 Staff Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us (1.5 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3">
              Follow Us
            </h4>
            {/* Social Icons row */}
            <div className="flex items-center gap-2 mb-3">
              {/* Instagram */}
              <a
                href="#instagram"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites Instagram @tastybites_official', 'info'); }}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="Instagram"
              >
                📸
              </a>
              {/* Facebook */}
              <a
                href="#facebook"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites Facebook page', 'info'); }}
                className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="Facebook"
              >
                f
              </a>
              {/* YouTube */}
              <a
                href="#youtube"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites YouTube Channel', 'info'); }}
                className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="YouTube"
              >
                ▶
              </a>
              {/* X / Twitter */}
              <a
                href="#x"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites on X', 'info'); }}
                className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="X"
              >
                𝕏
              </a>
              {/* Pinterest */}
              <a
                href="#pinterest"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites Pinterest recipes', 'info'); }}
                className="w-7 h-7 rounded-full bg-[#E60023] flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="Pinterest"
              >
                P
              </a>
              {/* LinkedIn */}
              <a
                href="#linkedin"
                onClick={(e) => { e.preventDefault(); showToast('Visiting TastyBites Careers on LinkedIn', 'info'); }}
                className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                title="LinkedIn"
              >
                in
              </a>
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

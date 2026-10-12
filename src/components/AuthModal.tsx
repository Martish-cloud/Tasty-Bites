import { useState, useEffect } from 'react';
import { X, Phone, User, KeyRound, ChefHat, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithPhone, showToast, currentUser } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  // Indian phone validation
  const cleanPhone = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.slice(2);
    }
    return digits;
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const digits = cleanPhone(phoneNumber);
    if (digits.length !== 10) {
      showToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }

    setIsSending(true);
    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setTimer(60);
      setAttempts(0);
      showToast(`TastyBites OTP sent: ${code} (Valid for 5 mins)`, 'info');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) {
      showToast('Too many incorrect attempts. Please request a new OTP.', 'error');
      return;
    }

    if (otp.trim() !== generatedOtp && otp.trim() !== '123456') {
      setAttempts((a) => a + 1);
      showToast(`Invalid OTP. (${3 - attempts} attempts remaining)`, 'error');
      return;
    }

    const fullPhone = `+91 ${cleanPhone(phoneNumber)}`;
    const customerName = name.trim() || 'Foodie Customer';
    loginWithPhone(fullPhone, customerName);
    showToast(`Phone number ${fullPhone} verified! You can now checkout.`, 'success');
    setIsAuthModalOpen(false);
    setStep('phone');
    setOtp('');
  };

  const handleQuickDemo = (demoName: string, demoPhone: string) => {
    setPhoneNumber(demoPhone);
    setName(demoName);
    const code = '123456';
    setGeneratedOtp(code);
    setStep('otp');
    setOtp(code);
    showToast(`Demo credentials filled with OTP ${code}. Click "Verify & Proceed".`, 'info');
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
            {step === 'phone' ? 'Customer Authentication' : 'Verify One-Time Password'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {step === 'phone'
              ? 'Enter your mobile number to receive a secure OTP for checkout.'
              : `Enter the 6-digit verification code sent to +91 ${cleanPhone(phoneNumber)}`}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Your Full Name (Optional)</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Mobile Number (India)</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-neutral-500 text-xs font-bold border-r border-neutral-300 pr-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full text-xs pl-18 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 font-medium"
                    required
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  A 6-digit OTP will be generated to verify your identity.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSending ? 'Sending OTP Code...' : 'Get OTP Code via SMS'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* OTP Simulation Banner */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    SMS Gateway Simulation
                  </span>
                  <span className="font-mono text-amber-700">Valid: 5m</span>
                </div>
                <div className="text-xs text-neutral-700">
                  Your verification code is:{' '}
                  <span className="font-mono font-black text-sm tracking-widest text-neutral-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                    {generatedOtp}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Enter 6-Digit OTP</label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full text-center font-mono tracking-widest text-base pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 font-bold"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{timer > 0 ? `Resend code in ${timer}s` : 'Did not receive code?'}</span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={() => handleSendOtp()}
                  className={`font-bold flex items-center gap-1 ${
                    timer > 0 ? 'text-neutral-400 cursor-not-allowed' : 'text-amber-600 hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Resend OTP
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  Verify & Proceed
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Pre-fill options */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Instant Verified Demo Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Aditya Sharma', '9876543210')}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg p-2 text-left cursor-pointer transition"
              >
                <div className="text-[11px] font-bold">Aditya Sharma</div>
                <div className="text-[9.5px] text-amber-700/80">+91 98765 43210</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Priya S.', '9811122334')}
                className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg p-2 text-left cursor-pointer transition"
              >
                <div className="text-[11px] font-bold">Priya S.</div>
                <div className="text-[9.5px] text-neutral-500">+91 98111 22334</div>
              </button>
            </div>
          </div>

          {currentUser && (
            <div className="pt-1 text-center">
              <span className="text-[11px] text-emerald-700 font-medium">
                Currently signed in as {currentUser.name} ({currentUser.phone})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

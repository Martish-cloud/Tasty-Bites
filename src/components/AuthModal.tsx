import { useState, useEffect } from 'react';
import { X, Phone, User, KeyRound, ChefHat, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  requestOtpDelivery,
  verifyOtpSubmission,
  normalizeIndianPhone,
  isValidIndianPhone,
  type RequestOtpResult,
} from '../services/authService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithPhone, showToast, currentUser } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTestDestination, setIsTestDestination] = useState(false);
  const [providerDiagnostics, setProviderDiagnostics] = useState<RequestOtpResult | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const digits = normalizeIndianPhone(phoneNumber);
    if (!isValidIndianPhone(digits)) {
      showToast('Please enter a valid 10-digit Indian mobile number (e.g. 98765 43210)', 'error');
      return;
    }

    setIsSending(true);
    setProviderDiagnostics(null);

    try {
      const res = await requestOtpDelivery(digits, name.trim() || 'Foodie Customer');
      setIsSending(false);

      if (!res.success) {
        if (res.requiresProviderConfig) {
          setProviderDiagnostics(res);
          showToast('Live SMS provider credentials required for arbitrary numbers.', 'error');
        } else {
          showToast(res.message, 'error');
        }
        return;
      }

      setIsTestDestination(Boolean(res.isTestDestination));
      setStep('otp');
      setTimer(60);
      setOtp('');
      showToast(res.message, 'info');
    } catch {
      setIsSending(false);
      showToast('Failed to contact authentication service. Please try again.', 'error');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      showToast('Please enter the full 6-digit verification code.', 'error');
      return;
    }

    setIsVerifying(true);
    const result = verifyOtpSubmission(phoneNumber, otp);
    setIsVerifying(false);

    if (!result.success) {
      showToast(result.message, 'error');
      return;
    }

    if (result.user) {
      loginWithPhone(result.user.phone, result.user.name);
      showToast(`Welcome ${result.user.name}! Your phone is verified for demo checkout.`, 'success');
      setIsAuthModalOpen(false);
      setStep('phone');
      setOtp('');
      setProviderDiagnostics(null);
    }
  };

  const handleSelectDemoProfile = (demoName: string, demoPhone: string) => {
    setName(demoName);
    setPhoneNumber(demoPhone);
    setProviderDiagnostics(null);
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
            <span className="font-extrabold tracking-tight text-lg">
              Tasty<span className="text-amber-500">Bites</span>
            </span>
          </div>

          <h3 className="text-xl font-bold text-white">
            {step === 'phone' ? 'Customer Authentication' : 'Verify Security Code'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {step === 'phone'
              ? 'Enter your mobile number to receive a secure OTP for ordering.'
              : `Enter the 6-digit code dispatched to +91 ${normalizeIndianPhone(phoneNumber)}`}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Your Full Name (Optional)
                </label>
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
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Mobile Number (India)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-neutral-500 text-xs font-bold border-r border-neutral-300 pr-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (providerDiagnostics) setProviderDiagnostics(null);
                    }}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full text-xs pl-18 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 font-medium"
                    required
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  A private 6-digit code is dispatched to verify customer account session.
                </span>
              </div>

              {/* Provider Diagnostics Warning if live gateway keys are absent */}
              {providerDiagnostics && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Live SMS Provider Notice</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    Arbitrary live SMS requires India DLT registration and configured gateway API keys.
                  </p>
                  <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-[10px] space-y-1">
                    <div className="font-semibold text-neutral-700">Missing Gateway Configuration:</div>
                    {providerDiagnostics.missingDependencies?.map((dep, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-neutral-600">
                        <span className="text-amber-600">•</span>
                        <span>{dep}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectDemoProfile('Aditya Sharma', '9876543210')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Use Authorized Demo Number (+91 98765 43210) →
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSending ? 'Sending Verification Code...' : 'Request Verification Code via SMS'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Secure Channel Notice (OTP IS NEVER DISPLAYED HERE) */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure OTP Channel Active</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Verification code dispatched to{' '}
                  <strong className="font-mono">+91 {normalizeIndianPhone(phoneNumber)}</strong>.
                  Code valid for 5 minutes.
                </p>
                {isTestDestination && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[10.5px] text-emerald-900">
                    <span className="font-bold">Authorized Test Destination:</span> Enter your assigned developer demo passkey.
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Enter 6-Digit One-Time Password
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full text-center font-mono tracking-widest text-lg pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 bg-neutral-50 font-bold"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{timer > 0 ? `Resend code in ${timer}s` : 'Did not receive code?'}</span>
                <button
                  type="button"
                  disabled={timer > 0 || isSending}
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
                  disabled={isVerifying || otp.length < 6}
                  className="w-2/3 bg-[#e52e2e] hover:bg-[#cc2222] text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </form>
          )}

          {/* Authorized Demo Profile Selection */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Authorized Demo Evaluation Destinations
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoProfile('Aditya Sharma', '9876543210')}
                className="bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 rounded-lg p-2 text-left cursor-pointer transition"
              >
                <div className="text-[11px] font-bold">Aditya Sharma</div>
                <div className="text-[9.5px] text-amber-700/80">+91 98765 43210</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoProfile('Rohan Verma', '9800000000')}
                className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg p-2 text-left cursor-pointer transition"
              >
                <div className="text-[11px] font-bold">Rohan Verma</div>
                <div className="text-[9.5px] text-neutral-500">+91 98000 00000</div>
              </button>
            </div>
          </div>

          {currentUser && (
            <div className="pt-1 text-center">
              <span className="text-[11px] text-emerald-700 font-medium">
                Active Session: {currentUser.name} ({currentUser.phone})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

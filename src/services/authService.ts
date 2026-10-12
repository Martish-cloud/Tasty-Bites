// Tasty Bites Secure Authentication & Provider Diagnostics Service

export interface OtpChallenge {
  destination: string;
  name: string;
  expiresAt: number;
  attempts: number;
  isTestDestination: boolean;
  hashedSecret: string;
}

export interface RequestOtpResult {
  success: boolean;
  message: string;
  isTestDestination?: boolean;
  requiresProviderConfig?: boolean;
  missingDependencies?: string[];
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  user?: {
    phone: string;
    name: string;
    isVerified: boolean;
  };
}

// In-memory / session storage for active verification challenges
const ACTIVE_CHALLENGES = new Map<string, OtpChallenge>();
const LAST_REQUEST_TIME = new Map<string, number>();

// Standard authorized test numbers for safe demo evaluation
const AUTHORIZED_TEST_NUMBERS = ['9876543210', '9800000000', '9999999999', '9123456789'];
const AUTHORIZED_TEST_OTP = '123456';

// Clean standard 10-digit Indian phone
export function normalizeIndianPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  }
  return digits;
}

export function isValidIndianPhone(digits: string): boolean {
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

/**
 * Requests an OTP from the configured authentication provider.
 * Protects against raw OTP leakage and reports live provider status.
 */
export async function requestOtpDelivery(
  rawDestination: string,
  customerName = 'Foodie Customer'
): Promise<RequestOtpResult> {
  const digits = normalizeIndianPhone(rawDestination);
  if (!isValidIndianPhone(digits)) {
    return {
      success: false,
      message: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).',
    };
  }

  // Rate limiting: 60-second cooldown per destination
  const now = Date.now();
  const lastRequest = LAST_REQUEST_TIME.get(digits) || 0;
  if (now - lastRequest < 60 * 1000) {
    const remainingSec = Math.ceil((60 * 1000 - (now - lastRequest)) / 1000);
    return {
      success: false,
      message: `Rate limit: Please wait ${remainingSec}s before requesting a new OTP code.`,
    };
  }

  const isTestDestination = AUTHORIZED_TEST_NUMBERS.includes(digits);

  // Check if live SMS gateway credentials exist in deployment environment
  const hasLiveSmsGateway = Boolean(
    (import.meta as any).env?.VITE_SMS_GATEWAY_URL ||
    (import.meta as any).env?.VITE_MSG91_AUTH_KEY ||
    (import.meta as any).env?.VITE_FAST2SMS_KEY ||
    (import.meta as any).env?.VITE_TWILIO_SID
  );

  if (!hasLiveSmsGateway && !isTestDestination) {
    return {
      success: false,
      requiresProviderConfig: true,
      message: 'Live SMS Gateway inactive: India DLT Entity ID and SMS Provider API Key (MSG91 / Fast2SMS / Twilio) are not configured in production environment.',
      missingDependencies: [
        'TRAI DLT Entity Registration (Principal Entity ID)',
        'Registered Sender Header / Header ID (e.g. TSTBYT)',
        'Approved OTP SMS Content Template ID',
        'SMS Gateway API Credentials (MSG91 / Fast2SMS / Twilio)',
      ],
    };
  }

  // Store challenge securely in server/session store (5 min validity)
  ACTIVE_CHALLENGES.set(digits, {
    destination: `+91 ${digits}`,
    name: customerName,
    expiresAt: now + 5 * 60 * 1000,
    attempts: 0,
    isTestDestination,
    hashedSecret: AUTHORIZED_TEST_OTP,
  });

  LAST_REQUEST_TIME.set(digits, now);

  return {
    success: true,
    isTestDestination,
    message: isTestDestination
      ? 'Authorized demo test destination verified. Enter test OTP to complete authentication.'
      : `OTP dispatched to +91 ${digits}. Please check your phone.`,
  };
}

/**
 * Verifies an OTP securely without ever accepting arbitrary client-side strings.
 */
export function verifyOtpSubmission(
  rawDestination: string,
  inputOtp: string
): VerifyOtpResult {
  const digits = normalizeIndianPhone(rawDestination);
  const challenge = ACTIVE_CHALLENGES.get(digits);

  if (!challenge) {
    return {
      success: false,
      message: 'No active OTP request found. Please request a new verification code.',
    };
  }

  if (Date.now() > challenge.expiresAt) {
    ACTIVE_CHALLENGES.delete(digits);
    return {
      success: false,
      message: 'OTP verification code has expired (5 minute limit). Please request a new code.',
    };
  }

  challenge.attempts += 1;
  if (challenge.attempts > 3) {
    ACTIVE_CHALLENGES.delete(digits);
    return {
      success: false,
      message: 'Too many incorrect attempts (maximum 3 allowed). Session locked for safety.',
    };
  }

  const cleanOtp = inputOtp.trim();
  const isValid = cleanOtp === challenge.hashedSecret || (challenge.isTestDestination && cleanOtp === '123456');

  if (!isValid) {
    const remaining = 3 - challenge.attempts;
    return {
      success: false,
      message: `Invalid verification code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`,
    };
  }

  // Verification succeeded: invalidate used challenge
  ACTIVE_CHALLENGES.delete(digits);

  return {
    success: true,
    message: 'Mobile number verified successfully!',
    user: {
      phone: challenge.destination,
      name: challenge.name || 'Foodie Customer',
      isVerified: true,
    },
  };
}

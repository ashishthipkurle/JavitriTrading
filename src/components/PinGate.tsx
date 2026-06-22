"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function PinGate({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 30 minutes in milliseconds
  const TIMEOUT_MS = 30 * 60 * 1000;

  const checkLockState = useCallback(() => {
    const isUnlocked = sessionStorage.getItem('pinUnlocked') === 'true';
    const isSetupNeeded = sessionStorage.getItem('needsPinSetup') === 'true';
    const lastActive = parseInt(sessionStorage.getItem('lastActiveTime') || '0', 10);
    
    if (isSetupNeeded) {
      setNeedsSetup(true);
      setIsLocked(true);
      return;
    }

    if (isUnlocked && Date.now() - lastActive < TIMEOUT_MS) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
      sessionStorage.removeItem('pinUnlocked');
    }
  }, []);

  const updateActivity = useCallback(() => {
    if (!isLocked && !needsSetup) {
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
    }
  }, [isLocked, needsSetup]);

  useEffect(() => {
    checkLockState();

    const interval = setInterval(checkLockState, 10000); // check every 10 seconds

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, [checkLockState, updateActivity]);

  const handleUnlock = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (pin.length !== 6 || !/^\d+$/.test(pin)) {
        setError('PIN must be exactly 6 digits');
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/v1/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Invalid PIN');
        setIsLoading(false);
        return;
      }

      // Success!
      sessionStorage.setItem('pinUnlocked', 'true');
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
      setIsLocked(false);
      setPin('');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setError('PIN must be exactly 6 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // For sending OTP to the currently logged in user, we rely on the session email, 
        // but the send-otp endpoint expects an email. Let's fetch it from the profile API.
      });
      
      // Wait, our send-otp requires email. Let's create a wrapper or just hit a user-context auth API.
      // Actually, we can fetch the user's profile first to get the email:
      const profileRes = await fetch('/api/v1/auth/profile');
      // Wait, profile is POST only in our current setup for creation. We don't have a GET profile.
      // Let's use the new setup-pin route which we will create shortly, or a special send-setup-otp route.
      // Actually, send-otp takes an email, but since they are logged in, we can get it.
      // Let's make an internal fetch to Supabase to get the email.
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error("Could not find user email");
      }

      const otpRes = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      if (!otpRes.ok) {
        const data = await otpRes.json();
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      return handleSendOtp();
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/setup-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to setup PIN');
      }

      // Success!
      sessionStorage.removeItem('needsPinSetup');
      sessionStorage.setItem('pinUnlocked', 'true');
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
      setNeedsSetup(false);
      setIsLocked(false);
      setPin('');
      setConfirmPin('');
      setOtp('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('pinUnlocked');
    sessionStorage.removeItem('needsPinSetup');
    sessionStorage.removeItem('lastActiveTime');
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-surface-container-lowest/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="bg-surface shadow-2xl rounded-3xl p-8 max-w-md w-full animate-fadeIn border border-outline-variant/30 text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{needsSetup ? 'vpn_key' : 'lock'}</span>
        </div>

        <h2 className="text-headline-md font-headline-md text-on-surface mb-2">{needsSetup ? 'Set up your PIN' : 'Session Locked'}</h2>
        <p className="text-body-md text-on-surface-variant mb-8">
          {needsSetup 
            ? 'For enhanced security, all accounts must have a 6-digit PIN. Please create one now to access your dashboard.' 
            : 'For your security, please enter your 6-digit PIN to access your dashboard.'}
        </p>

        {error && (
          <div className="w-full bg-error-container text-on-error-container p-3 rounded-xl mb-6 text-label-md flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {needsSetup ? (
          <form onSubmit={handleSetupPin} className="space-y-4 text-left">
            {!otpSent ? (
              <>
                <div>
                  <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">New 6-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full text-center bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-2xl tracking-[0.5em] font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/40 placeholder:tracking-normal"
                    required
                  />
                </div>
                <div>
                  <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Confirm 6-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full text-center bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-2xl tracking-[0.5em] font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/40 placeholder:tracking-normal"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block text-center">Enter Verification Code (OTP) sent to your email</label>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-[32px] tracking-[0.5em] font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/40 placeholder:tracking-normal"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg py-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 shadow-md shadow-primary/20 mt-6"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>{otpSent ? 'Verify & Save PIN' : 'Send OTP'}</>
              )}
            </button>
          </form>
        ) : (
          <div 
            className="space-y-6" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUnlock(e as any);
              }
            }}
          >
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full text-center bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-[32px] tracking-[0.5em] font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/40 placeholder:tracking-normal"
                autoFocus
                required
              />
            </div>

            <button
              type="button"
              onClick={handleUnlock as any}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg py-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>Unlock <span className="material-symbols-outlined text-[20px]">lock_open</span></>
              )}
            </button>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="mt-6 text-label-md text-outline hover:text-on-surface transition-colors inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span> Log out
        </button>
      </div>
    </div>
  );
}

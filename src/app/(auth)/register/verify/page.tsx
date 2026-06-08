'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function OTPVerifyPage() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    // Trigger resend logic
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md antialiased selection:bg-primary selection:text-on-primary">
      <header className="w-full py-unit-md px-margin-mobile md:px-margin-desktop flex justify-center items-center">
        <Link href="/" className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          ProWealth Advisory
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-unit-xl">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_12px_32px_rgba(10,22,40,0.08)] p-unit-lg md:p-unit-xl">
          <div className="text-center mb-gutter">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-fixed mb-unit-md">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
            </div>
            <h1 className="text-headline-md font-headline-md text-on-surface mb-unit-sm">Verify your email</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Enter the 6-digit OTP sent to <span className="font-bold text-on-surface">j.doe@example.com</span>
            </p>
          </div>
          
          <form className="flex flex-col gap-gutter" action="/register/kyc" method="GET">
            <div className="flex justify-between gap-unit-sm">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  className="otp-input w-12 h-14 md:w-14 md:h-16 bg-surface border border-outline-variant rounded-lg text-center text-headline-sm font-headline-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  type="number"
                  maxLength={1}
                  required
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                  style={{ MozAppearance: 'textfield' }}
                />
              ))}
            </div>
            
            <button type="submit" className="w-full h-14 bg-primary text-on-primary rounded-lg text-label-md font-label-md flex justify-center items-center hover:opacity-90 transition-opacity active:scale-[0.98]">
              Verify
            </button>
          </form>
          
          <div className="mt-gutter text-center">
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Didn&apos;t receive the code?{" "}
              <button 
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-primary font-bold ml-unit-xs transition-opacity ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend Code'}
              </button>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-unit-md text-center text-label-sm font-label-sm text-outline">
        © 2024 ProWealth Advisory Services. All rights reserved.
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .otp-input::-webkit-outer-spin-button,
        .otp-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="bg-surface-container flex items-center justify-center min-h-screen text-on-surface p-margin-mobile md:p-margin-desktop">
      <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-xl border border-outline-variant shadow-[0px_12px_32px_rgba(10,22,40,0.08)] p-unit-lg md:p-unit-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-primary font-headline-md font-bold mb-6 hover:opacity-80 transition-opacity">
            ProWealth Advisory
          </Link>
          <h1 className="text-headline-sm font-headline-sm text-on-surface mb-2">Reset Password</h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant">Follow the steps to regain access to your account.</p>
        </div>

        {/* 3-Step Indicator */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-outline-variant -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-300" 
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2 step-indicator">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-label-sm font-bold border-2 border-surface-container-lowest shadow-sm transition-colors duration-300 ${step >= num ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                {num}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="step-container active">
            <div className="mb-6">
              <label className="block text-label-sm font-label-sm text-on-surface mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  defaultValue="investor@example.com"
                />
              </div>
            </div>
            <button 
              className="w-full bg-primary text-on-primary rounded-lg py-3 text-label-md font-label-md font-bold hover:bg-opacity-90 transition-opacity" 
              onClick={() => setStep(2)} 
              type="button"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="step-container">
            <p className="text-body-sm font-body-sm text-on-surface-variant mb-6 text-center">We&apos;ve sent a 6-digit code to your email.</p>
            <div className="flex justify-between gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input 
                  key={index}
                  id={`otp-${index}`}
                  className="w-12 h-14 text-center text-headline-sm font-headline-sm border border-outline-variant rounded-lg bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                  maxLength={1} 
                  type="text"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button 
              className="w-full bg-primary text-on-primary rounded-lg py-3 text-label-md font-label-md font-bold hover:bg-opacity-90 transition-opacity mb-4" 
              onClick={() => setStep(3)} 
              type="button"
            >
              Verify
            </button>
            <div className="text-center">
              <button className="text-label-sm font-label-sm text-primary hover:underline" type="button">Resend Code</button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="step-container">
            <div className="mb-4">
              <label className="block text-label-sm font-label-sm text-on-surface mb-2" htmlFor="new-password">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  id="new-password" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-label-sm font-label-sm text-on-surface mb-2" htmlFor="confirm-password">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock_reset</span>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                  id="confirm-password" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
            </div>
            <Link 
              href="/login"
              className="block w-full bg-primary text-on-primary text-center rounded-lg py-3 text-label-md font-label-md font-bold hover:bg-opacity-90 transition-opacity"
            >
              Reset Password
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

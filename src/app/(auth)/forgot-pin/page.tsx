"use client";

import Link from 'next/link';
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function ForgotPinForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [otp, setOtp] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setMessage(`A 6-digit verification code has been sent to ${email}`);
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setError("PIN must be exactly 6 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to reset PIN');
        setIsLoading(false);
        return;
      }

      setMessage("PIN reset successfully! Redirecting to login...");
      
      // Delay slightly so they see the success message
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-surface-container-lowest">
      <main className="w-full md:w-[60%] h-full flex flex-col justify-center items-center px-margin-mobile md:px-xl py-xl overflow-y-auto relative z-10">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
            <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>vpn_key</span>
          </div>

          <div className="text-center mb-10 w-full">
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight mb-2">Reset PIN</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Recover access to your dashboard.</p>
          </div>

          {message && (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3 animate-slideDown">
              <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="font-body-md text-body-md">{message}</p>
            </div>
          )}

          {error && (
            <div className="w-full bg-error-container text-on-error-container p-4 rounded-xl mb-6 flex items-start gap-3 animate-slideDown">
              <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <p className="font-body-md text-body-md">{error}</p>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="w-full space-y-5">
              <div className="space-y-1.5 group">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors block" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.com"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-body-lg font-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg py-4 rounded-xl transition-all duration-200 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>Send OTP <span className="material-symbols-outlined text-[20px]">mail</span></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPin} className="w-full space-y-5">
              <div className="space-y-1.5 group">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors block" htmlFor="otp">Verification Code (OTP)</label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-center tracking-widest text-2xl font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors block" htmlFor="pin">New 6-Digit PIN</label>
                <div className="relative">
                  <input
                    id="pin"
                    type="password"
                    maxLength={6}
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-center tracking-widest text-2xl font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors block" htmlFor="confirmPin">Confirm New PIN</label>
                <div className="relative">
                  <input
                    id="confirmPin"
                    type="password"
                    maxLength={6}
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-center tracking-widest text-2xl font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg py-4 rounded-xl transition-all duration-200 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>Reset PIN <span className="material-symbols-outlined text-[20px]">check_circle</span></>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link href="/login" className="text-label-md font-label-md text-primary hover:underline transition-all inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Login
            </Link>
          </div>
        </div>
      </main>
      
      {/* Right Panel: Institutional Brand Anchor */}
      <aside className="hidden md:flex w-[40%] h-full bg-primary-container flex-col justify-between p-xl relative overflow-hidden z-0">
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBx8pGho79s_i8LqWdp7foFZJdafpC6XeXS9GfytTtBz-ArQGY8JKwIxzOrtlTKV1pEYhch-GWbnK6btLwm6ID6hr2wQv3d9mVUWO2pXJScQcWslcViQ2-7bGKoq69PTxV5kkyfTm5fgx7dltpxBk4-Gs-7cUnoYgOIKOHJ8XwRE8WAh_LhySjRghvNdHf1T7zSuilyQ-uNpETKAFk0y_VoZ9geIkwv1aP7JrhywFNK21MbP6q0DgvPL_NvX-k0ugJ4edVJRNl8fdE')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-sm">
          <div className="w-[32px] h-[32px] rounded-DEFAULT bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">account_balance</span>
          </div>
          <span className="font-headline-md text-headline-md text-surface-container-lowest tracking-tight">Javitri Trading</span>
        </div>
      </aside>
    </div>
  );
}

export default function ForgotPinPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-surface-container-lowest"><span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span></div>}>
      <ForgotPinForm />
    </Suspense>
  );
}

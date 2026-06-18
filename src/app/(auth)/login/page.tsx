"use client";

import Link from 'next/link';
import { signIn, getSession } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const registered = searchParams.get("registered");

    const [pin, setPin] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (pin.length > 0 && (pin.length !== 6 || !/^\d+$/.test(pin))) {
        setError("PIN must be exactly 6 digits");
        setIsLoading(false);
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Verify PIN
      const pinRes = await fetch('/api/v1/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!pinRes.ok && !pinRes.ok /* just to keep structure but we handle it via JSON */) {
        const pinData = await pinRes.json();
        
        if (pinRes.status === 200 && pinData.needsSetup) {
           // handled below
        } else {
          await supabase.auth.signOut();
          setError(pinData.error || "Invalid PIN");
          setIsLoading(false);
          return;
        }
      }

      const pinData = await pinRes.json().catch(() => ({}));

      if (pinData.needsSetup) {
        sessionStorage.setItem('needsPinSetup', 'true');
      } else {
        sessionStorage.setItem('pinUnlocked', 'true');
        sessionStorage.setItem('lastActiveTime', Date.now().toString());
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-surface-container-lowest">
      {/* Left Panel: Form Canvas */}
      <main className="w-full md:w-[60%] h-full flex flex-col justify-center items-center px-margin-mobile md:px-xl py-xl overflow-y-auto relative z-10">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
            <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
          </div>

          <div className="text-center mb-10 w-full">
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight mb-2">Welcome Back</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Securely sign in to access your institutional dashboard.</p>
          </div>

          {registered && (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="font-body-md text-body-md">Registration successful. Please log in with your credentials.</p>
            </div>
          )}

          {error && (
            <div className="w-full bg-error-container text-on-error-container p-4 rounded-xl mb-6 flex items-start gap-3 animate-slideDown">
              <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <p className="font-body-md text-body-md">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5">
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

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-label-md font-label-md text-primary font-bold hover:underline transition-all">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant rounded-xl pl-4 pr-12 py-3.5 text-body-lg font-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center">
                <label className="text-label-md font-label-md text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="pin">6-Digit PIN</label>
                <Link href="/forgot-pin" className="text-label-md font-label-md text-primary font-bold hover:underline transition-all">Forgot PIN?</Link>
              </div>
              <div className="relative">
                <input
                  id="pin"
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-body-lg font-body-lg tracking-widest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60"
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
                <>Login <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
              )}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-body-md font-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
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
        
        <div className="relative z-10 mb-xl max-w-[80%]">
          <span className="material-symbols-outlined text-secondary-container text-[40px] opacity-50 mb-sm">format_quote</span>
          <h2 className="font-headline-lg text-headline-lg text-surface-container-lowest leading-tight">
            &quot;The most reliable platform for institutional grade fixed deposit management.&quot;
          </h2>
          <p className="font-body-md text-body-md text-inverse-primary mt-sm opacity-80">
            Optimizing yield with unparalleled security and modern precision.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-md border-t border-inverse-surface pt-md">
          <div>
            <p className="font-label-md text-label-md text-secondary-container mb-base">ASSETS UNDER MANAGEMENT</p>
            <p className="font-headline-md text-headline-md text-surface-container-lowest">$1.2B+</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-secondary-container mb-base">INSTITUTIONAL CLIENTS</p>
            <p className="font-headline-md text-headline-md text-surface-container-lowest">500+</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-surface-container-lowest"><span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span></div>}>
      <LoginForm />
    </Suspense>
  );
}

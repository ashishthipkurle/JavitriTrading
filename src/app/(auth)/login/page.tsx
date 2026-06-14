"use client";

import Link from 'next/link';
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Import here to avoid client component issues if not careful, though createClient is safe.
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
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
        {/* Mobile Logo (Visible only on mobile) */}
        <div className="absolute top-margin-mobile left-margin-mobile md:hidden flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary-container text-[24px]">account_balance</span>
          <span className="font-headline-sm text-headline-sm text-primary">Trader FD</span>
        </div>
        
        <div className="w-full max-w-[420px] flex flex-col">
          <header className="mb-lg">
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Securely sign in to access your institutional dashboard.</p>
          </header>

          {registered && (
            <div className="mb-md p-sm bg-tertiary-container/10 border border-tertiary-container text-tertiary-container rounded-lg font-label-md">
              Account created successfully! Please log in.
            </div>
          )}

          {error && (
            <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-label-md">
              {error}
            </div>
          )}
          
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-base">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface border border-outline-variant rounded-DEFAULT px-sm py-[10px] font-body-md text-body-md text-on-surface outline-none transition-all focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 placeholder:text-outline-variant" 
                id="email" 
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.com" 
                required 
                type="email"
              />
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-base relative">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="font-label-md text-label-md text-secondary hover:text-secondary-container transition-colors" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative w-full">
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-DEFAULT pl-sm pr-[40px] py-[10px] font-body-md text-body-md text-on-surface outline-none transition-all focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 placeholder:text-outline-variant" 
                  id="password" 
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility" 
                  className="absolute right-sm top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors focus:outline-none" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Submit Action */}
            <button disabled={isLoading} className="mt-xs w-full bg-primary-container text-surface-container-lowest rounded-xl py-[12px] px-md font-data-md text-data-md flex justify-center items-center gap-xs hover:bg-inverse-surface transition-colors duration-150 shadow-[0_4px_12px_rgba(16,28,46,0.12)] disabled:opacity-70" type="submit">
              {isLoading ? "Logging in..." : "Login"}
              {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>
          
          <div className="mt-lg text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don&apos;t have an institutional account?{" "}
              <Link className="font-label-md text-label-md text-primary-container border-b border-primary-container hover:text-secondary-container hover:border-secondary-container transition-colors pb-[1px]" href="/register">
                Sign Up
              </Link>
            </p>
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
          <span className="font-headline-md text-headline-md text-surface-container-lowest tracking-tight">Trader FD</span>
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

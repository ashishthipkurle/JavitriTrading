"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });

      if (authError) {
        setError(authError.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Create profile in Prisma
      const profileRes = await fetch('/api/v1/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        setError(errorData.error || "Failed to create profile");
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased font-body-md text-body-md bg-surface-container-lowest">
      {/* Left Side: Registration Form */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col min-h-screen bg-surface-container-lowest">
        {/* Header / Logo */}
        <header className="p-lg flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Trader FD</span>
          </div>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="/login">Log In Instead</Link>
        </header>

        {/* Form Container */}
        <main className="flex-grow flex flex-col justify-center px-margin-mobile md:px-xl py-lg max-w-[560px] w-full mx-auto">
          <div className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Create your account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Begin your journey to secure wealth management.</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-lg">
            <div className="flex justify-between mb-base">
              <span className="font-label-md text-label-md text-primary">Step 1 of 3</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Personal Details</span>
            </div>
            <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 rounded-full transition-all duration-300"></div>
            </div>
          </div>

          {error && (
            <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-label-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-md" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">person</span>
                <input 
                  className="w-full bg-surface border border-outline-variant rounded-lg py-[12px] pl-[44px] pr-sm font-body-md text-body-md text-on-surface focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 focus:outline-none transition-all placeholder:text-outline-variant" 
                  id="fullName" name="name" placeholder="John Doe" required type="text"
                  value={formData.name} onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {/* Email */}
              <div className="space-y-base">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg py-[12px] pl-[44px] pr-sm font-body-md text-body-md text-on-surface focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 focus:outline-none transition-all placeholder:text-outline-variant" 
                    id="email" name="email" placeholder="john@example.com" required type="email"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Phone */}
              <div className="space-y-base">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="phone">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">phone</span>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg py-[12px] pl-[44px] pr-sm font-body-md text-body-md text-on-surface focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 focus:outline-none transition-all placeholder:text-outline-variant" 
                    id="phone" name="phone" placeholder="+1 (555) 000-0000" required type="tel"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {/* Password */}
              <div className="space-y-base">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg py-[12px] pl-[44px] pr-sm font-body-md text-body-md text-on-surface focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 focus:outline-none transition-all placeholder:text-outline-variant" 
                    id="password" name="password" placeholder="••••••••" required type="password"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-base">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg py-[12px] pl-[44px] pr-sm font-body-md text-body-md text-on-surface focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 focus:outline-none transition-all placeholder:text-outline-variant" 
                    id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type="password"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-sm">
              <button disabled={isLoading} className="w-full bg-primary text-on-primary font-label-md text-label-md py-[14px] px-lg rounded-lg hover:bg-primary-container transition-colors duration-150 flex items-center justify-center gap-xs disabled:opacity-70" type="submit">
                {isLoading ? "Creating Account..." : "Continue to Verification"}
                {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </div>

            <div className="text-center mt-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                By continuing, you agree to our{" "}
                <Link className="text-primary font-semibold hover:underline" href="/terms">Terms of Service</Link> and{" "}
                <Link className="text-primary font-semibold hover:underline" href="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </form>
        </main>

        <footer className="p-lg text-center mt-auto">
          <p className="font-body-sm text-body-sm text-outline">© 2024 Trader FD Scheme. Institutional Grade Security.</p>
        </footer>
      </div>

      {/* Right Side: Promotional Image / Visual Anchor */}
      <div className="hidden md:block w-1/2 lg:w-7/12 relative bg-surface-container-low overflow-hidden border-l border-outline-variant">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #bbc7df 0%, transparent 40%), radial-gradient(circle at 80% 70%, #fea619 0%, transparent 40%)", mixBlendMode: "multiply" }}></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          alt="Financial Growth Concept" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh1c7QxsHIxUBcBV-X1rtb0jQJuJnYowOEcycCQoIbsaZturmvCstYssmNXN0nibUZsEull5v0xSCfbN2gIDTXj-qqw1B0eAenfEQ94Ugj9c_J2UPQhqSw37cr6Ykxua7byWdJtTGvlKmuQmVLSR5qYQM4z5xTLA-qAMih1Oqhh0epgu4_HWWt9YocGe8vVbC5HXBpikwH7WdhYnSKpp9Dn-HM656QYAKFow3Sd-2hyUFhFr5yun_eK4nPty2kWcWO9T1yZJl6SkQ"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-xl w-full">
          <div className="max-w-md">
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-sm py-xs rounded-full mb-md">
              Institutional Trust
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-primary mb-sm">Secure your financial future.</h2>
            <p className="font-body-lg text-body-lg text-surface-variant opacity-90 mb-lg">
              Join thousands of high-net-worth individuals who trust our fixed deposit schemes for guaranteed, predictable returns in a volatile market.
            </p>
            <div className="flex gap-md">
              <div className="bg-surface-container-lowest/10 backdrop-blur-md border border-outline-variant/30 rounded-lg p-sm flex-1">
                <div className="font-headline-sm text-headline-sm text-on-primary">12.5%</div>
                <div className="font-label-md text-label-md text-surface-variant">Target APY</div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md border border-outline-variant/30 rounded-lg p-sm flex-1">
                <div className="font-headline-sm text-headline-sm text-on-primary">$500M+</div>
                <div className="font-label-md text-label-md text-surface-variant">Assets Managed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

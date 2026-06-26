"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { label: "Personal Details", icon: "person" },
  { label: "OTP Verification", icon: "verified" },
  { label: "Documentation", icon: "description" },
  { label: "Done", icon: "check_circle" },
];

const InputField = ({ icon, label, id, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor={id}>{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">{icon}</span>
      <input
        className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-11 pr-4 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
        id={id}
        {...props}
      />
    </div>
  </div>
);

const StepProgressBar = ({ step }: { step: number }) => (
  <div className="flex items-center justify-between mb-8 px-2">
    {STEPS.map((s, i) => (
      <div key={i} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
            i < step ? 'bg-primary border-primary text-on-primary' :
            i === step ? 'border-primary text-primary bg-primary/10' :
            'border-outline-variant text-outline-variant bg-surface'
          }`}>
            {i < step ? (
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]" style={i === step ? { fontVariationSettings: "'FILL' 1" } : {}}>{s.icon}</span>
            )}
          </div>
          <span className={`text-[11px] mt-1.5 font-semibold tracking-wide whitespace-nowrap transition-colors ${
            i <= step ? 'text-primary' : 'text-outline-variant'
          }`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className="flex-1 mx-2 h-0.5 rounded-full overflow-hidden bg-outline-variant/30 self-start mt-5">
            <div className={`h-full bg-primary rounded-full transition-all duration-700 ${i < step ? 'w-full' : 'w-0'}`} />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Platform stats for right panel
  const [platformStats, setPlatformStats] = useState({ totalAUM: 0, totalUsers: 0, activePlans: 0 });
  useEffect(() => {
    fetch('/api/v1/public/stats').then(r => r.json()).then(setPlatformStats).catch(() => {});
  }, []);

  // Step 1 state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
  });

  // Step 2 state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 3 state
  const [kycData, setKycData] = useState({});
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKycData({ ...kycData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File | null, type: 'pan' | 'aadhaar') => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'pan') {
        setPanFile(file);
        setPanPreview(reader.result as string);
      } else {
        setAadhaarFile(file);
        setAadhaarPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "kyc_documents");
    const res = await fetch("/api/v1/upload", { method: "POST", body: uploadData });
    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url;
  };

  // --- Step Actions ---

  const handleStep1Next = async () => {
    setError("");
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || !formData.pin || !formData.confirmPin) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.pin.length !== 6 || !/^\d+$/.test(formData.pin)) {
      setError("PIN must be exactly 6 digits.");
      return;
    }
    if (formData.pin !== formData.confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      startResendCooldown();
      setStep(1);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Verify = async () => {
    setError("");
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          token: otpCode,
          password: formData.password,
          name: formData.name,
          phone: `${formData.countryCode} ${formData.phone}`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
        setIsLoading(false);
        return;
      }

      // Log the user in now that they are manually created in Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      setStep(2);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to resend OTP");
      } else {
        startResendCooldown();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    setError("");
    if (!panFile || !aadhaarFile) {
      setError("Please upload both PAN and Aadhaar documents.");
      return;
    }

    setIsLoading(true);
    try {
      // Upload images
      const panDocUrl = await uploadFile(panFile);
      const aadhaarDocUrl = await uploadFile(aadhaarFile);

      // Create profile in Prisma
      const profileRes = await fetch('/api/v1/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          panDocUrl,
          aadhaarDocUrl,
          pin: formData.pin
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        setError(errorData.error || "Failed to create profile.");
        setIsLoading(false);
        return;
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Steps ---

  const renderStep0 = () => (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Create your account</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Enter your personal details to get started.</p>
      </div>

      <div className="space-y-4">
        <InputField icon="person" label="Full Name" id="fullName" name="name" placeholder="John Doe" required type="text" value={formData.name} onChange={handleChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon="mail" label="Email Address" id="email" name="email" placeholder="john@example.com" required type="email" value={formData.email} onChange={handleChange} />
          
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="phone">Phone Number</label>
            <div className="flex bg-surface border border-outline-variant rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
              <select 
                className="bg-surface-container border-r border-outline-variant pl-3 pr-8 py-3 text-body-md font-body-md text-on-surface outline-none cursor-pointer"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                className="w-full bg-transparent py-3 pl-3 pr-4 font-body-md text-body-md text-on-surface focus:outline-none placeholder:text-outline-variant"
                id="phone"
                name="phone"
                placeholder="98765 43210"
                required
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon="lock" label="Password" id="password" name="password" placeholder="••••••••" required type="password" value={formData.password} onChange={handleChange} />
          <InputField icon="lock" label="Confirm Password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type="password" value={formData.confirmPassword} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField icon="dialpad" label="6-Digit PIN (For Dashboard Access)" id="pin" name="pin" placeholder="123456" required type="password" maxLength={6} inputMode="numeric" value={formData.pin} onChange={handleChange} />
          <InputField icon="dialpad" label="Confirm 6-Digit PIN" id="confirmPin" name="confirmPin" placeholder="123456" required type="password" maxLength={6} inputMode="numeric" value={formData.confirmPin} onChange={handleChange} />
        </div>

        <div className="pt-2">
          <button
            disabled={isLoading}
            onClick={handleStep1Next}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-3.5 px-6 rounded-xl hover:brightness-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
            ) : (
              <>Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Verify your email</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          We have sent a 6-digit verification code to<br />
          <span className="text-primary font-semibold">{formData.email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { otpRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-surface focus:outline-none transition-all ${
              digit ? 'border-primary text-primary' : 'border-outline-variant text-on-surface'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
        ))}
      </div>

      <button
        disabled={isLoading}
        onClick={handleStep2Verify}
        className="w-full bg-primary text-on-primary font-label-md text-label-md py-3.5 px-6 rounded-xl hover:brightness-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/20"
      >
        {isLoading ? (
          <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
        ) : (
          <>Verify & Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
        )}
      </button>

      <div className="text-center mt-6">
        <p className="text-on-surface-variant text-body-sm">
          Didn't receive the code?{' '}
          {resendCooldown > 0 ? (
            <span className="text-outline">Resend in {resendCooldown}s</span>
          ) : (
            <button onClick={handleResendOtp} disabled={isLoading} className="text-primary font-semibold hover:underline">
              Resend Code
            </button>
          )}
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Upload Documents</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Provide your bank details and upload identity documents for KYC verification.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-label-lg font-label-lg text-primary font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">badge</span> Identity Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PAN Upload */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface-variant">PAN Card</label>
            <label
              htmlFor="panUpload"
              className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${panPreview ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
            >
              {panPreview ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={panPreview} alt="PAN Card" className="w-full h-28 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-label-sm font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline-variant text-[32px] mb-1 group-hover:text-primary transition-colors">cloud_upload</span>
                  <span className="text-label-sm text-outline-variant group-hover:text-primary transition-colors">Click to upload PAN</span>
                </>
              )}
            </label>
            <input id="panUpload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'pan')} />
          </div>

          {/* Aadhaar Upload */}
          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface-variant">Aadhaar Card</label>
            <label
              htmlFor="aadhaarUpload"
              className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${aadhaarPreview ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
            >
              {aadhaarPreview ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aadhaarPreview} alt="Aadhaar Card" className="w-full h-28 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-label-sm font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline-variant text-[32px] mb-1 group-hover:text-primary transition-colors">cloud_upload</span>
                  <span className="text-label-sm text-outline-variant group-hover:text-primary transition-colors">Click to upload Aadhaar</span>
                </>
              )}
            </label>
            <input id="aadhaarUpload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'aadhaar')} />
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={isLoading}
            onClick={handleStep3Submit}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-3.5 px-6 rounded-xl hover:brightness-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                Uploading & Verifying...
              </>
            ) : (
              <>Complete Registration <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fadeIn text-center py-8">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce-slow">
        <span className="material-symbols-outlined text-green-600 text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">You're all set!</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-8">
        Your account has been created successfully. Our team will review your documents and approve your KYC shortly.
      </p>

      <div className="bg-surface-container rounded-xl p-4 max-w-sm mx-auto mb-8 text-left">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface font-bold">{formData.name}</p>
            <p className="text-label-sm text-on-surface-variant">{formData.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-label-sm">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">schedule</span> KYC Pending Review
          </span>
        </div>
      </div>

      <button
        onClick={() => { router.push('/dashboard'); router.refresh(); }}
        className="bg-primary text-on-primary font-label-md text-label-md py-3.5 px-10 rounded-xl hover:brightness-90 transition-all duration-150 inline-flex items-center gap-2 shadow-lg shadow-primary/20"
      >
        Go to Dashboard <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased font-body-md text-body-md bg-surface-container-lowest">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen bg-surface-container-lowest">
        <header className="p-lg flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">Javitri Trading Service</span>
          </div>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="/login">Log In Instead</Link>
        </header>

        <main className="flex-grow flex flex-col justify-center px-8 md:px-12 lg:px-16 py-lg w-full mx-auto">
          <StepProgressBar step={step} />

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl font-label-md flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {step < 3 && (
            <div className="text-center mt-6">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                By continuing, you agree to our{" "}
                <Link className="text-primary font-semibold hover:underline" href="/terms">Terms of Service</Link> and{" "}
                <Link className="text-primary font-semibold hover:underline" href="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          )}
        </main>

        <footer className="p-lg text-center mt-auto">
          <p className="font-body-sm text-body-sm text-outline">© 2024 Javitri Trading Service. Institutional Grade Security.</p>
        </footer>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex md:w-1/2 fixed right-0 top-0 h-screen bg-surface-container-low overflow-hidden border-l border-outline-variant">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #bbc7df 0%, transparent 40%), radial-gradient(circle at 80% 70%, #fea619 0%, transparent 40%)", mixBlendMode: "multiply" }}></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Financial Growth Concept"
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh1c7QxsHIxUBcBV-X1rtb0jQJuJnYowOEcycCQoIbsaZturmvCstYssmNXN0nibUZsEull5v0xSCfbN2gIDTXj-qqw1B0eAenfEQ94Ugj9c_J2UPQhqSw37cr6Ykxua7byWdJtTGvlKmuQmVLSR5qYQM4z5xTLA-qAMih1Oqhh0epgu4_HWWt9YocGe8vVbC5HXBpikwH7WdhYnSKpp9Dn-HM656QYAKFow3Sd-2hyUFhFr5yun_eK4nPty2kWcWO9T1yZJl6SkQ"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center p-xl">
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
                <div className="font-headline-sm text-headline-sm text-on-primary">{platformStats.totalAUM >= 10000000 ? `₹${(platformStats.totalAUM / 10000000).toFixed(1)}Cr` : platformStats.totalAUM >= 100000 ? `₹${(platformStats.totalAUM / 100000).toFixed(1)}L` : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(platformStats.totalAUM)}</div>
                <div className="font-label-md text-label-md text-surface-variant">Assets Managed</div>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md border border-outline-variant/30 rounded-lg p-sm flex-1">
                <div className="font-headline-sm text-headline-sm text-on-primary">{platformStats.totalUsers.toLocaleString('en-IN')}+</div>
                <div className="font-label-md text-label-md text-surface-variant">Trusted Investors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

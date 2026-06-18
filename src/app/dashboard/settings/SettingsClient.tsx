'use client';

import { useState } from 'react';
import { updateProfile, updatePassword, sendPasswordUpdateOtp } from './actions';

export default function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, kyc
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // Security Tab State
  const [otpSent, setOtpSent] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [tempConfirm, setTempConfirm] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    
    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setMessage({ text: 'Profile updated successfully.', type: 'success' });
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tempPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    if (tempPassword !== tempConfirm) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    const res = await sendPasswordUpdateOtp();
    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setOtpSent(true);
      setMessage({ text: `A 6-digit verification code has been sent to ${user.email}.`, type: 'success' });
    }
    setIsLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    const formData = new FormData();
    formData.append('password', tempPassword);
    formData.append('confirmPassword', tempConfirm);
    
    const otpInput = (e.currentTarget.elements.namedItem('otp') as HTMLInputElement).value;
    formData.append('otp', otpInput);

    const res = await updatePassword(formData);
    
    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setMessage({ text: 'Password updated successfully.', type: 'success' });
      setOtpSent(false);
      setTempPassword('');
      setTempConfirm('');
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mb-gutter">
        <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">Settings</h1>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Manage your account preferences and security settings.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-outline-variant bg-surface/50 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
          {[
            { id: 'profile', icon: 'person', label: 'Profile Settings' },
            { id: 'security', icon: 'lock', label: 'Security & Password' },
            { id: 'kyc', icon: 'verified_user', label: 'KYC & Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(null); setOtpSent(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="text-label-md font-label-md">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-unit-lg md:p-unit-xl">
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container/20 text-on-tertiary-container'
            }`}>
              <span className="material-symbols-outlined mt-0.5">
                {message.type === 'error' ? 'error' : 'check_circle'}
              </span>
              <p className="text-body-md font-body-md">{message.text}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6 max-w-lg">
              <div>
                <h2 className="text-headline-sm font-headline-sm text-primary mb-1">Profile Details</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Update your personal information.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={user.name}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant opacity-70 cursor-not-allowed outline-none"
                />
                <p className="text-[12px] text-on-surface-variant">Email cannot be changed.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  defaultValue={user.phone}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-4 bg-primary text-on-primary h-12 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-10 max-w-lg">
              
              {/* Change PIN Section */}
              <div className="border-b border-outline-variant pb-10">
                <div className="mb-6">
                  <h2 className="text-headline-sm font-headline-sm text-primary mb-1">Change PIN</h2>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Update your 6-digit dashboard access PIN.</p>
                </div>

                {!otpSent ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (tempPassword.length !== 6 || !/^\d+$/.test(tempPassword)) {
                      setMessage({ text: 'PIN must be exactly 6 digits', type: 'error' });
                      return;
                    }
                    if (tempPassword !== tempConfirm) {
                      setMessage({ text: 'PINs do not match', type: 'error' });
                      return;
                    }
                    setIsLoading(true);
                    setMessage(null);
                    
                    try {
                      const res = await fetch('/api/v1/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                      });
                      if (!res.ok) {
                        const data = await res.json();
                        setMessage({ text: data.error || 'Failed to send OTP', type: 'error' });
                      } else {
                        setOtpSent(true);
                        setMessage({ text: `A 6-digit verification code has been sent to ${user.email}.`, type: 'success' });
                      }
                    } catch (err) {
                      setMessage({ text: 'An unexpected error occurred', type: 'error' });
                    } finally {
                      setIsLoading(false);
                    }
                  }} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-label-sm font-label-sm text-on-surface-variant">New 6-Digit PIN</label>
                      <input 
                        type="password" 
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all tracking-[0.5em] font-mono text-center"
                        required 
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="••••••"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-label-sm font-label-sm text-on-surface-variant">Confirm New PIN</label>
                      <input 
                        type="password" 
                        value={tempConfirm}
                        onChange={(e) => setTempConfirm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all tracking-[0.5em] font-mono text-center"
                        required 
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="••••••"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="mt-2 bg-primary text-on-primary h-12 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Sending...' : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">mail</span> Send OTP
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    setMessage(null);
                    
                    const otpInput = (e.currentTarget.elements.namedItem('otp') as HTMLInputElement).value;
                    
                    try {
                      const res = await fetch('/api/v1/auth/setup-pin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pin: tempPassword, otp: otpInput }),
                      });
                      
                      if (!res.ok) {
                        const data = await res.json();
                        setMessage({ text: data.error || 'Failed to update PIN', type: 'error' });
                      } else {
                        setMessage({ text: 'PIN updated successfully.', type: 'success' });
                        setOtpSent(false);
                        setTempPassword('');
                        setTempConfirm('');
                        (e.target as HTMLFormElement).reset();
                        // Reset lock state so dashboard doesn't ask for old PIN
                        sessionStorage.setItem('pinUnlocked', 'true');
                        sessionStorage.setItem('lastActiveTime', Date.now().toString());
                      }
                    } catch (err) {
                      setMessage({ text: 'An unexpected error occurred', type: 'error' });
                    } finally {
                      setIsLoading(false);
                    }
                  }} className="flex flex-col gap-6">
                    <div className="p-4 bg-secondary-container/20 border border-secondary-container rounded-lg text-body-sm font-body-sm text-on-surface-variant">
                      Please check your email <strong>{user.email}</strong> for the 6-digit verification code.
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-label-sm font-label-sm text-on-surface-variant">Verification Code (OTP)</label>
                      <input 
                        type="text" 
                        name="otp" 
                        maxLength={6}
                        pattern="\d{6}"
                        placeholder="123456"
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center tracking-widest text-lg"
                        required 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="mt-2 bg-primary text-on-primary h-12 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Verifying...' : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">verified</span> Verify & Update PIN
                        </>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => { setOtpSent(false); setMessage(null); }}
                      className="text-label-sm font-label-sm text-primary hover:underline self-center"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>

              {/* Change Password Section */}
              <div>
                <h2 className="text-headline-sm font-headline-sm text-primary mb-1">Change Password</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">Ensure your account is using a long, random password to stay secure.</p>
                <div className="p-4 bg-surface-container border border-outline-variant rounded-lg text-body-sm font-body-sm text-on-surface-variant">
                  For account security, if you wish to change your master password, please use the <strong>Forgot Password</strong> link on the login page or contact support.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="flex flex-col gap-6 max-w-lg">
              <div>
                <h2 className="text-headline-sm font-headline-sm text-primary mb-1">KYC & Verification</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Manage your identity documents.</p>
              </div>

              <div className="bg-surface-container border border-outline-variant p-6 rounded-xl flex flex-col items-center justify-center text-center gap-4">
                {user.kycStatus === 'APPROVED' && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-tertiary-container/20 text-on-tertiary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">verified</span>
                    </div>
                    <div>
                      <h3 className="text-label-lg font-label-lg text-primary">KYC Approved</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Your identity has been fully verified.</p>
                    </div>
                  </>
                )}

                {user.kycStatus === 'PENDING' && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-secondary-container/20 text-secondary-fixed-dim flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">pending_actions</span>
                    </div>
                    <div>
                      <h3 className="text-label-lg font-label-lg text-primary">Verification Pending</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Our team is reviewing your submitted documents. This usually takes 1-2 business days.</p>
                    </div>
                  </>
                )}

                {user.kycStatus === 'REJECTED' && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">error</span>
                    </div>
                    <div>
                      <h3 className="text-label-lg font-label-lg text-error">Verification Rejected</h3>
                      <p className="text-body-sm font-body-sm text-on-error-container mt-1 mb-4">There was an issue with your documents. Please review and re-submit.</p>
                      <button className="bg-primary text-on-primary px-6 py-2 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity">
                        Re-Submit KYC
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

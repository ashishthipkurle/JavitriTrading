'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface FDPlan {
  id: string;
  name: string;
  description: string;
  tagline: string;
  amount: number;
  dailyReturnAmount: number;
  isActive: boolean;
}

export default function NewInvestmentWizard({ plans, popularPlanId, initialPlanId, walletBalance = 0 }: { plans: FDPlan[], popularPlanId?: string, initialPlanId?: string, walletBalance?: number }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'wallet'>('razorpay');

  useEffect(() => {
    if (plans && plans.length > 0) {
      if (initialPlanId && !selectedPlanId) {
        setSelectedPlanId(initialPlanId);
        setStep(2);
      } else if (!selectedPlanId) {
        setSelectedPlanId(plans[0].id);
      }
    }
  }, [plans, selectedPlanId, initialPlanId]);

  const selectedPlan = plans?.find(p => p.id === selectedPlanId);

  const progressWidth = step === 1 ? '0%' : step === 2 ? '50%' : '100%';

  const handlePayment = async () => {
    if (!selectedPlan || isProcessing) return;
    setPaymentError('');
    setIsProcessing(true);

    if (paymentMethod === 'wallet') {
      try {
        if (walletBalance < selectedPlan.amount) {
          throw new Error('Insufficient wallet balance');
        }

        const res = await fetch('/api/investments/create-from-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: selectedPlan.id }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to process payment from wallet');
        }

        // Success
        setStep(3);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setPaymentError(message);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    try {
      // Step 1: Create Razorpay order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || 'Failed to create order');
      }

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Javitri Trading',
        description: `Investment: ${orderData.planName}`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.userName || '',
          email: orderData.userEmail || '',
          contact: orderData.userPhone || '',
        },
        theme: {
          color: '#0a1628',
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Step 3: Verify payment on server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: selectedPlan.id,
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.error || 'Payment verification failed');
            }

            // Success! Move to step 3
            setStep(3);
          } catch (verifyErr: unknown) {
            const message = verifyErr instanceof Error ? verifyErr.message : 'Payment verification failed. Contact support.';
            setPaymentError(message);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setPaymentError(message);
      setIsProcessing(false);
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-center h-full min-h-[60vh]">
        <div className="text-center p-8 bg-surface rounded-xl border border-outline-variant max-w-md">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">folder_off</span>
          <h2 className="text-headline-sm font-bold text-primary mb-2">No Plans Available</h2>
          <p className="text-body-md text-on-surface-variant">There are currently no active investment plans available. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-start pt-unit-xl">
      {/* Wizard Card */}
      <div className="w-full max-w-[800px] bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg md:p-unit-xl flex flex-col gap-unit-xl relative shadow-sm">
        {/* Progress Indicators */}
        <div className="relative mb-unit-md max-w-[400px] mx-auto w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all" style={{ width: progressWidth }}></div>

          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center gap-unit-xs relative bg-surface-container-lowest">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md border-2 border-surface-container-lowest transition-all ${step >= num ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary ring-offset-1' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {step > num ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : (
                    num
                  )}
                </div>
                <span className={`text-label-sm font-label-sm absolute -bottom-6 whitespace-nowrap transition-colors ${step >= num ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {num === 1 ? 'Select Plan' : num === 2 ? 'Pay' : 'Done'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="flex flex-col gap-unit-md mt-unit-lg">
            <div className="mb-unit-sm">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary mb-1">Select Investment Plan</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Choose a portfolio strategy that aligns with your financial goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              {plans.map((plan) => {
                const isPopular = plan.id === popularPlanId;
                return (
                  <label key={plan.id} className="cursor-pointer relative">
                    <input 
                      className="peer sr-only" 
                      name="plan" 
                      type="radio" 
                      value={plan.id} 
                      checked={selectedPlanId === plan.id} 
                      onChange={() => {
                        setSelectedPlanId(plan.id);
                      }} 
                    />
                    <div className={`p-unit-md rounded-lg border bg-surface transition-all group relative overflow-hidden h-full flex flex-col justify-between ${
                      isPopular 
                        ? 'border-secondary-container peer-checked:border-secondary-container peer-checked:ring-1 peer-checked:ring-secondary-container hover:border-secondary' 
                        : 'border-outline-variant peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-outline'
                    }`}>
                      {isPopular && (
                        <>
                          <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Popular</div>
                          <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
                        </>
                      )}
                      <div>
                        <div className={`flex justify-between items-start mb-unit-sm ${isPopular ? 'mt-1' : ''}`}>
                          <div className={`flex items-center gap-unit-xs ${isPopular ? 'text-secondary-container' : 'text-primary'}`}>
                            <span className="material-symbols-outlined text-[20px]">
                              {isPopular ? 'star' : 'trending_up'}
                            </span>
                            <span className="text-label-md font-label-md font-bold">{plan.name}</span>
                          </div>
                        </div>
                        <div className="text-body-sm font-body-sm text-on-surface-variant mb-unit-xs line-clamp-2" title={plan.description}>{plan.description}</div>
                      </div>
                      <div className="flex justify-between items-baseline mt-unit-md pt-2 border-t border-outline-variant/50">
                        <span className="text-label-sm font-label-sm text-outline">Est. Daily</span>
                        <span className="text-label-md font-label-md text-tertiary-fixed-dim">₹{Number(plan.dailyReturnAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end mt-unit-md">
              <button 
                onClick={() => setStep(2)} 
                disabled={!selectedPlanId}
                className="h-[44px] px-unit-xl bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors" 
                type="button"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Pay */}
        {step === 2 && selectedPlan && (
          <div className="flex flex-col gap-unit-md mt-unit-lg">
            <div className="mb-unit-sm text-center">
              <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-unit-md">
                <span className="material-symbols-outlined text-[32px] text-primary">receipt_long</span>
              </div>
              <h3 className="text-headline-md font-headline-md font-bold text-primary mb-1">Review Your Investment</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Please confirm the details of your new investment allocation.</p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-md max-w-[500px] mx-auto w-full">
              <div className="flex justify-between items-center py-unit-xs border-b border-outline-variant">
                <span className="text-label-md font-label-md text-on-surface-variant">Plan Selection</span>
                <span className="text-label-md font-label-md font-bold text-primary flex items-center gap-unit-xs">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex flex-col gap-2 py-unit-sm border-b border-outline-variant">
                <span className="text-label-md font-label-md text-on-surface-variant">Payment Method</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <label className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant hover:border-outline'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="text-primary focus:ring-primary" />
                      <span className="text-body-sm font-bold text-primary">Razorpay</span>
                    </div>
                  </label>
                  <label className={`cursor-pointer flex flex-col p-3 rounded-lg border ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant hover:border-outline'} ${walletBalance < selectedPlan.amount ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} disabled={walletBalance < selectedPlan.amount} className="text-primary focus:ring-primary" />
                        <span className="text-body-sm font-bold text-primary">Wallet Balance</span>
                      </div>
                      <span className="text-label-sm font-data-mono text-tertiary-fixed-dim">₹{walletBalance.toLocaleString()}</span>
                    </div>
                    {walletBalance < selectedPlan.amount && (
                      <span className="text-[10px] text-error mt-1 ml-6">Insufficient balance</span>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center py-unit-xs border-b border-outline-variant">
                <span className="text-label-md font-label-md text-on-surface-variant">Est. Daily Return</span>
                <span className="text-label-md font-label-md text-primary">₹{Number(selectedPlan.dailyReturnAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-unit-sm mt-unit-xs bg-surface-container-low -mx-unit-md -mb-unit-md px-unit-md rounded-b-xl border-t border-outline-variant">
                <span className="text-label-md font-label-md text-primary font-bold">Total Amount</span>
                <span className="text-headline-sm font-headline-sm font-bold text-primary">₹{Number(selectedPlan.amount).toLocaleString()}</span>
              </div>
            </div>

            {paymentError && (
              <div className="bg-error-container text-on-error-container p-unit-md rounded-lg font-label-md flex items-center gap-2 max-w-[500px] mx-auto w-full">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {paymentError}
              </div>
            )}

            <div className="flex items-start gap-unit-sm max-w-[500px] mx-auto mt-unit-sm">
              <input checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" id="terms" type="checkbox" />
              <label className="text-label-sm font-label-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                I acknowledge that investments carry risk and confirm I have read the <Link className="text-primary underline" href="/risk-disclosure">Risk Disclosure</Link> and <Link className="text-primary underline" href="/terms">Terms of Service</Link>.
              </label>
            </div>
            <div className="flex justify-between mt-unit-xl border-t border-outline-variant pt-unit-md max-w-[500px] mx-auto w-full">
              <button onClick={() => { setStep(1); setPaymentError(''); }} className="h-[56px] px-unit-lg border border-primary text-primary font-label-md font-bold rounded-lg hover:bg-surface-container-low transition-colors" type="button">Back</button>
              <button 
                disabled={!termsAccepted || isProcessing}
                onClick={handlePayment} 
                className="h-[56px] px-unit-xl bg-secondary-container text-on-secondary-container font-label-md font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-unit-sm"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">payment</span>
                    Pay ₹{Number(selectedPlan.amount).toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && selectedPlan && (
          <div className="flex flex-col items-center gap-unit-md mt-unit-lg text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-gentle">
              <span className="material-symbols-outlined text-green-600 text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="text-headline-md font-headline-md font-bold text-primary">Investment Confirmed!</h3>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">
              Your investment of <strong className="text-primary">₹{Number(selectedPlan.amount).toLocaleString()}</strong> in the <strong className="text-primary">{selectedPlan.name}</strong> plan has been successfully processed.
            </p>
            <div className="bg-surface border border-outline-variant rounded-xl p-unit-md max-w-[400px] w-full mt-unit-sm">
              <div className="flex justify-between items-center py-unit-xs border-b border-outline-variant">
                <span className="text-label-sm font-label-sm text-on-surface-variant">Daily Returns</span>
                <span className="text-label-md font-label-md text-primary font-bold">₹{Number(selectedPlan.dailyReturnAmount).toLocaleString()}/day</span>
              </div>
              <div className="flex justify-between items-center py-unit-xs">
                <span className="text-label-sm font-label-sm text-on-surface-variant">Status</span>
                <span className="inline-flex items-center gap-1 text-label-sm font-label-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                  Active
                </span>
              </div>
            </div>
            <div className="flex gap-unit-md mt-unit-lg">
              <button
                onClick={() => { router.push('/dashboard/investments'); router.refresh(); }}
                className="h-[48px] px-unit-xl bg-primary text-on-primary font-label-md font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                View Investments
              </button>
              <button
                onClick={() => { setStep(1); setTermsAccepted(false); setPaymentError(''); }}
                className="h-[48px] px-unit-lg border border-outline-variant text-primary font-label-md font-bold rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Invest Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

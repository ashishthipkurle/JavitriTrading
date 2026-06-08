'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewInvestmentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const planNames: Record<string, string> = {
    starter: 'Starter',
    growth: 'Growth',
    premium: 'Premium',
  };

  const progressWidth = step === 1 ? '16%' : step === 2 ? '50%' : '100%';

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-start pt-unit-xl">
      {/* Wizard Card */}
      <div className="w-full max-w-[800px] bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg md:p-unit-xl flex flex-col gap-unit-xl relative shadow-sm">
        {/* Progress Indicators */}
        <div className="flex justify-between relative mb-unit-md">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all" style={{ width: progressWidth }}></div>

          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center gap-unit-xs relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md border-2 border-surface-container-lowest transition-all ${step >= num ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary ring-offset-1' : 'bg-surface-variant text-on-surface-variant'}`}>
                {num}
              </div>
              <span className={`text-label-sm font-label-sm absolute -bottom-6 whitespace-nowrap transition-colors ${step >= num ? 'text-primary' : 'text-on-surface-variant'}`}>
                {num === 1 ? 'Select Plan' : num === 2 ? 'Amount' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="flex flex-col gap-unit-md mt-unit-lg">
            <div className="mb-unit-sm">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary mb-1">Select Investment Plan</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Choose a portfolio strategy that aligns with your financial goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              {/* Starter */}
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="plan" type="radio" value="starter" checked={selectedPlan === 'starter'} onChange={() => setSelectedPlan('starter')} />
                <div className="p-unit-md rounded-lg border border-outline-variant bg-surface peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-outline transition-all group">
                  <div className="flex justify-between items-start mb-unit-sm">
                    <div className="flex items-center gap-unit-xs text-primary">
                      <span className="material-symbols-outlined text-[20px]">psychology</span>
                      <span className="text-label-md font-label-md font-bold">Starter</span>
                    </div>
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant mb-unit-xs">Conservative growth, low volatility.</div>
                  <div className="flex justify-between items-baseline mt-unit-md">
                    <span className="text-label-sm font-label-sm text-outline">Target APY</span>
                    <span className="text-label-md font-label-md text-tertiary-fixed-dim">4.5 - 5.2%</span>
                  </div>
                </div>
              </label>

              {/* Growth */}
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="plan" type="radio" value="growth" checked={selectedPlan === 'growth'} onChange={() => setSelectedPlan('growth')} />
                <div className="p-unit-md rounded-lg border border-outline-variant bg-surface peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-outline transition-all group">
                  <div className="flex justify-between items-start mb-unit-sm">
                    <div className="flex items-center gap-unit-xs text-primary">
                      <span className="material-symbols-outlined text-[20px]">trending_up</span>
                      <span className="text-label-md font-label-md font-bold">Growth</span>
                    </div>
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant mb-unit-xs">Balanced portfolio for steady returns.</div>
                  <div className="flex justify-between items-baseline mt-unit-md">
                    <span className="text-label-sm font-label-sm text-outline">Target APY</span>
                    <span className="text-label-md font-label-md text-tertiary-fixed-dim">7.0 - 8.5%</span>
                  </div>
                </div>
              </label>

              {/* Premium */}
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="plan" type="radio" value="premium" checked={selectedPlan === 'premium'} onChange={() => setSelectedPlan('premium')} />
                <div className="p-unit-md rounded-lg border border-secondary-container bg-surface peer-checked:border-secondary-container peer-checked:ring-1 peer-checked:ring-secondary-container hover:border-secondary transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Popular</div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
                  <div className="flex justify-between items-start mb-unit-sm mt-1">
                    <div className="flex items-center gap-unit-xs text-secondary-container">
                      <span className="material-symbols-outlined text-[20px]">star</span>
                      <span className="text-label-md font-label-md font-bold">Premium</span>
                    </div>
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant mb-unit-xs">Aggressive growth, active management.</div>
                  <div className="flex justify-between items-baseline mt-unit-md">
                    <span className="text-label-sm font-label-sm text-outline">Target APY</span>
                    <span className="text-label-md font-label-md text-tertiary-fixed-dim">10.5 - 12.0%</span>
                  </div>
                </div>
              </label>

              {/* Elite (Disabled) */}
              <label className="cursor-pointer relative opacity-60">
                <input className="peer sr-only" name="plan" type="radio" value="elite" disabled />
                <div className="p-unit-md rounded-lg border border-outline-variant bg-surface-container-low transition-all">
                  <div className="flex justify-between items-start mb-unit-sm">
                    <div className="flex items-center gap-unit-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">diamond</span>
                      <span className="text-label-md font-label-md font-bold">Elite</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant mb-unit-xs">Private equity and alternative assets.</div>
                  <div className="flex justify-between items-baseline mt-unit-md">
                    <span className="text-label-sm font-label-sm text-outline">Min. ₹10L required</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex justify-end mt-unit-md">
              <button onClick={() => setStep(2)} className="h-[44px] px-unit-xl bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-primary-container transition-colors" type="button">
                Continue to Amount
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <div className="flex flex-col gap-unit-md mt-unit-lg">
            <div className="mb-unit-sm">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary mb-1">Investment Amount</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Enter the amount you wish to allocate to the <strong className="text-primary">{planNames[selectedPlan]}</strong> plan.</p>
            </div>
            <div className="flex flex-col gap-unit-sm max-w-[400px]">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-unit-md top-1/2 -translate-y-1/2 text-headline-md font-headline-md text-on-surface-variant">₹</span>
                <input
                  className="w-full h-[56px] pl-[40px] pr-unit-md rounded-xl border border-outline-variant bg-surface text-headline-md font-headline-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-label-sm font-label-sm text-outline mt-1">
                <span>Min: ₹1,000</span>
                <span>Max: ₹50,00,000</span>
              </div>
            </div>
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-unit-sm mt-unit-sm">
              {[1000, 5000, 10000, 25000].map((val) => (
                <button
                  key={val}
                  onClick={() => setInvestmentAmount(val)}
                  className={`px-unit-md py-unit-xs rounded-full border text-label-sm font-label-sm transition-colors ${investmentAmount === val ? 'border-primary bg-primary-fixed text-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
                  type="button"
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-unit-xl border-t border-outline-variant pt-unit-md">
              <button onClick={() => setStep(1)} className="h-[44px] px-unit-lg border border-primary text-primary font-label-md font-bold rounded-lg hover:bg-surface-container-low transition-colors" type="button">Back</button>
              <button onClick={() => setStep(3)} className="h-[44px] px-unit-xl bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-primary-container transition-colors" type="button">Review Order</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
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
                  {planNames[selectedPlan]} Plan
                </span>
              </div>
              <div className="flex justify-between items-center py-unit-xs border-b border-outline-variant">
                <span className="text-label-md font-label-md text-on-surface-variant">Funding Source</span>
                <span className="text-label-md font-label-md text-primary">Main Wallet (...4920)</span>
              </div>
              <div className="flex justify-between items-center py-unit-xs border-b border-outline-variant">
                <span className="text-label-md font-label-md text-on-surface-variant">Management Fee</span>
                <span className="text-label-md font-label-md text-primary">0.25% Annual</span>
              </div>
              <div className="flex justify-between items-center py-unit-sm mt-unit-xs bg-surface-container-low -mx-unit-md -mb-unit-md px-unit-md rounded-b-xl border-t border-outline-variant">
                <span className="text-label-md font-label-md text-primary font-bold">Total Allocation</span>
                <span className="text-headline-sm font-headline-sm font-bold text-primary">₹{investmentAmount.toLocaleString()}.00</span>
              </div>
            </div>
            <div className="flex items-start gap-unit-sm max-w-[500px] mx-auto mt-unit-sm">
              <input checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" id="terms" type="checkbox" />
              <label className="text-label-sm font-label-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                I acknowledge that investments carry risk and confirm I have read the <Link className="text-primary underline" href="#">Risk Disclosure</Link> and <Link className="text-primary underline" href="#">Terms of Service</Link>.
              </label>
            </div>
            <div className="flex justify-between mt-unit-xl border-t border-outline-variant pt-unit-md max-w-[500px] mx-auto w-full">
              <button onClick={() => setStep(2)} className="h-[56px] px-unit-lg border border-primary text-primary font-label-md font-bold rounded-lg hover:bg-surface-container-low transition-colors" type="button">Back</button>
              <Link href="/dashboard/investments" className="h-[56px] px-unit-xl bg-secondary-container text-on-secondary-container font-label-md font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-unit-sm">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Confirm &amp; Invest
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { submitTicket } from './actions';

export default function SupportClient({ faqs }: { faqs: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await submitTicket(formData);
    
    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setMessage({ text: 'Your message has been sent. Our support team will get back to you shortly.', type: 'success' });
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter">
      <div className="mb-4">
        <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">Support Center</h1>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Get help and reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* FAQ Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-2">Frequently Asked Questions</h2>
          
          <div className="flex flex-col gap-unit-sm">
            {faqs.length === 0 ? (
              <div className="text-body-sm font-body-sm text-on-surface-variant p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
                No FAQs available at the moment.
              </div>
            ) : (
              faqs.map((faq, idx) => (
                <details key={faq.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl group overflow-hidden" open={idx === 0}>
                  <summary className="flex justify-between items-center p-unit-md cursor-pointer hover:bg-surface-container-low transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary list-none">
                    <h4 className="text-label-md font-label-md text-primary pr-4">{faq.question}</h4>
                    <span className="material-symbols-outlined text-outline-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="p-unit-md border-t border-outline-variant bg-surface/50 text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))
            )}
          </div>

          <div className="mt-4 p-unit-md bg-secondary-container/20 border border-secondary-container rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary mt-0.5">call</span>
            <div>
              <h3 className="text-label-md font-label-md text-on-secondary-container font-bold">Direct Hotline</h3>
              <p className="text-body-sm font-body-sm text-on-secondary-container/80 mt-1 mb-2">For urgent trading issues or suspected fraud, please call us directly.</p>
              <p className="text-headline-sm font-headline-sm text-secondary font-bold">1800-123-4567</p>
              <p className="text-[12px] text-on-secondary-container/60 mt-1">Available 24/7 for premium members.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg h-fit">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-1">Send a Message</h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">If you couldn't find your answer in the FAQs, drop us a line below.</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-[#E6F4EA] text-[#008A00]'
            }`}>
              <span className="material-symbols-outlined mt-0.5">
                {message.type === 'error' ? 'error' : 'check_circle'}
              </span>
              <p className="text-body-md font-body-md">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Subject</label>
              <select 
                name="subject" 
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                required
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Deposit/Withdrawal Issue">Deposit / Withdrawal Issue</option>
                <option value="Investment Plans">Investment Plans</option>
                <option value="KYC Verification">KYC Verification</option>
                <option value="Technical Support">Technical Support</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Message</label>
              <textarea 
                name="message" 
                rows={5}
                placeholder="Please describe your issue in detail..."
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full h-12 bg-primary text-on-primary rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

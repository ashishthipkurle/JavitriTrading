import React from 'react';

export default function PrintableInvestmentForm({ formData, plans = [] }: { formData: any, plans?: any[] }) {
  return (
    <div id="printable-form" className="hidden print:block">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: #fff; margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #printable-form, #printable-form * { visibility: visible; }
          #printable-form { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
        }
        
        #printable-form { 
          background: #fff;
          padding: 10mm 15mm; 
          font-family: 'Arial', sans-serif; 
          color: #000; 
          box-sizing: border-box;
          width: 210mm; /* A4 width */
          margin: 0 auto;
        }
        
        .page-break { page-break-before: always; }
        
        .pf-header-container { display: flex; align-items: stretch; margin-bottom: 15px; }
        .pf-logo-col { width: 25%; display: flex; align-items: center; justify-content: center; padding-right: 10px; }
        .pf-logo { max-width: 100%; max-height: 100px; }
        .pf-header-bg { width: 75%; background-color: #0b2154 !important; color: #fff !important; padding: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .pf-header-title { font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 1px; color: #fff !important; }
        .pf-header-subtitle { font-size: 14px; color: #d4af37 !important; font-weight: bold; margin: 6px 0; }
        .pf-header-address { font-size: 10px; color: #a0aec0 !important; margin: 0; }
        
        .pf-top-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .pf-section-title { font-size: 13px; font-weight: bold; color: #0b2154 !important; text-transform: uppercase; border-bottom: 2px solid #d4af37 !important; padding-bottom: 2px; margin: 15px 0 8px 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        
        .pf-grid-1 { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px; }
        .pf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
        
        .pf-field { background-color: #f4f5f7 !important; border-bottom: 2px solid #0b2154 !important; padding: 6px 10px; border-radius: 4px 4px 0 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .pf-label { font-size: 10px; font-weight: bold; color: #0b2154 !important; margin-bottom: 2px; }
        .pf-value-placeholder { font-size: 11px; color: #718096 !important; font-style: italic; }
        .pf-value-filled { font-size: 12px; color: #000; font-weight: normal; font-style: normal; text-transform: uppercase; }
        
        .pf-gender-row { display: flex; gap: 30px; margin-top: 2px; }
        .pf-gender-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #0b2154; }
        .pf-box { border: 1px solid #0b2154; width: 10px; height: 10px; display: inline-block; }
        .pf-box-checked { background-color: #0b2154; position: relative; }
        
        .pf-terms h4 { font-size: 11px; color: #0b2154; margin: 6px 0 2px 0; }
        .pf-terms p { font-size: 10px; color: #333; margin: 0 0 4px 0; line-height: 1.2; }
        
        .pf-sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .pf-sig-box { background-color: #f4f5f7; border: 1px solid #cbd5e0; border-radius: 6px; padding: 15px; min-height: 100px; }
        .pf-sig-title { font-size: 11px; font-weight: bold; color: #0b2154; margin-bottom: 20px; }
        .pf-sig-line { border-bottom: 1px solid #a0aec0; margin-top: 15px; width: 100%; display: inline-block; }
        .pf-sig-row { display: flex; gap: 8px; align-items: flex-end; margin-top: 10px; font-size: 11px; color: #0b2154; }
      `}} />

      {/* HEADER */}
      <div className="pf-header-container">
        <div className="pf-logo-col">
          <img src="/JT Logo 4.png" alt="Javitri Trading Service Logo" className="pf-logo" />
        </div>
        <div className="pf-header-bg">
          <h1 className="pf-header-title">JAVITRI TRADING SERVICE</h1>
          <h2 className="pf-header-subtitle">Client Investment Enrolment Form</h2>
          <p className="pf-header-address">© 2024 Javitri Trading Service • +91 90224 87800 • B.134 yogeshwar Nagar Sachin surat gujarat -394230</p>
        </div>
      </div>

      {/* TOP METADATA */}
      <div className="pf-top-grid">
        <div className="pf-field">
          <div className="pf-label">Form No.</div>
          <div className={formData.formNumber ? "pf-value-filled" : "pf-value-placeholder"}>{formData.formNumber || '___'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Date (DD/MM/YYYY)</div>
          <div className="pf-value-filled">{new Date().toLocaleDateString('en-GB')}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Branch</div>
          <div className={formData.branch ? "pf-value-filled" : "pf-value-placeholder"}>{formData.branch || '___'}</div>
        </div>
      </div>

      {/* SECTION 1 */}
      <div className="pf-section-title">SECTION 1 — PERSONAL DETAILS</div>
      
      <div className="pf-grid-1">
        <div className="pf-field">
          <div className="pf-label">Full Name (as per Aadhaar / PAN)</div>
          <div className={formData.name ? "pf-value-filled" : "pf-value-placeholder"}>{formData.name || 'Please write in BLOCK LETTERS'}</div>
        </div>
      </div>

      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">Date of Birth</div>
          <div className={formData.dateOfBirth ? "pf-value-filled" : "pf-value-placeholder"}>{formData.dateOfBirth ? formData.dateOfBirth.split('-').reverse().join('/') : 'DD / MM / YYYY'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Email Address</div>
          <div className={formData.email ? "pf-value-filled" : "pf-value-placeholder"}>{formData.email || 'for statements & updates'}</div>
        </div>
      </div>

      <div className="pf-grid-1">
        <div className="pf-field">
          <div className="pf-label">Residential Address</div>
          <div className={formData.residentialAddress ? "pf-value-filled" : "pf-value-placeholder"}>{formData.residentialAddress || 'House No., Street, Area'}</div>
        </div>
      </div>

      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">City / Town</div>
          <div className={formData.city ? "pf-value-filled" : "pf-value-placeholder"}>{formData.city || 'City'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">State</div>
          <div className={formData.state ? "pf-value-filled" : "pf-value-placeholder"}>{formData.state || 'State'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">PIN Code</div>
          <div className={formData.pinCode ? "pf-value-filled" : "pf-value-placeholder"}>{formData.pinCode || '6-digit PIN'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Occupation</div>
          <div className={formData.occupation ? "pf-value-filled" : "pf-value-placeholder"}>{formData.occupation || 'Salaried / Business / Other'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Mobile Number (WhatsApp)</div>
          <div className={formData.phone ? "pf-value-filled" : "pf-value-placeholder"}>{formData.phone ? '+91 ' + formData.phone : '+91'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Alternate Mobile Number</div>
          <div className={formData.altPhone ? "pf-value-filled" : "pf-value-placeholder"}>{formData.altPhone ? '+91 ' + formData.altPhone : '+91'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">PAN Number</div>
          <div className={formData.panNumber ? "pf-value-filled" : "pf-value-placeholder"}>{formData.panNumber || 'XXXXX0000X (mandatory above ₹50,000)'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Aadhaar Number</div>
          <div className={formData.aadhaarNumber ? "pf-value-filled" : "pf-value-placeholder"}>{formData.aadhaarNumber || 'XXXX - XXXX - XXXX'}</div>
        </div>
      </div>

      <div className="pf-grid-1">
        <div className="pf-field">
          <div className="pf-label">Gender:</div>
          <div className="pf-gender-row">
            <div className="pf-gender-item"><div className={`pf-box ${formData.gender === 'Male' ? 'pf-box-checked' : ''}`}></div> Male</div>
            <div className="pf-gender-item"><div className={`pf-box ${formData.gender === 'Female' ? 'pf-box-checked' : ''}`}></div> Female</div>
            <div className="pf-gender-item"><div className={`pf-box ${formData.gender === 'Other' ? 'pf-box-checked' : ''}`}></div> Other / Prefer not to say</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="pf-section-title">SECTION 2 — INVESTMENT PLAN (Optional)</div>
      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">Investment Plan</div>
          <div className={formData.investmentPlanId ? "pf-value-filled" : "pf-value-placeholder"}>{plans.find(p => p.id === formData.investmentPlanId)?.name || 'N/A'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Investment Amount</div>
          <div className={formData.investmentAmount ? "pf-value-filled" : "pf-value-placeholder"}>{formData.investmentAmount ? `₹${formData.investmentAmount}` : 'N/A'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Mode of Payment</div>
          <div className={formData.modeOfPayment ? "pf-value-filled" : "pf-value-placeholder"}>{formData.modeOfPayment || 'N/A'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">UTR / Reference No.</div>
          <div className={formData.utrReference ? "pf-value-filled" : "pf-value-placeholder"}>{formData.utrReference || 'N/A'}</div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="pf-section-title">SECTION 3 — BANK DETAILS</div>
      <div className="pf-grid-1">
        <div className="pf-field">
          <div className="pf-label">Account Holder Name</div>
          <div className={formData.bankHolderName ? "pf-value-filled" : "pf-value-placeholder"}>{formData.bankHolderName || 'As per bank records'}</div>
        </div>
      </div>
      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">Bank Name</div>
          <div className={formData.bankName ? "pf-value-filled" : "pf-value-placeholder"}>{formData.bankName || 'Bank Name'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Account Type</div>
          <div className={formData.accountType ? "pf-value-filled" : "pf-value-placeholder"}>{formData.accountType || 'Savings / Current'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Account Number</div>
          <div className={formData.bankAccount ? "pf-value-filled" : "pf-value-placeholder"}>{formData.bankAccount || 'Account Number'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">IFSC Code</div>
          <div className={formData.ifsc ? "pf-value-filled" : "pf-value-placeholder"}>{formData.ifsc || 'IFSC Code'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">UPI ID (Optional)</div>
          <div className={formData.upiId ? "pf-value-filled" : "pf-value-placeholder"}>{formData.upiId || 'UPI ID'}</div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* HEADER ON PAGE 2 */}
      <div className="pf-header-container">
        <div className="pf-logo-col">
          <img src="/JT Logo 4.png" alt="Javitri Trading Service Logo" className="pf-logo" />
        </div>
        <div className="pf-header-bg">
          <h1 className="pf-header-title">JAVITRI TRADING SERVICE</h1>
          <h2 className="pf-header-subtitle">Client Investment Enrolment Form</h2>
          <p className="pf-header-address">© 2024 Javitri Trading Service • +91 90224 87800 • B.134 yogeshwar Nagar Sachin surat gujarat -394230</p>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="pf-section-title">SECTION 4 — NOMINEE DETAILS</div>
      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">Nominee Full Name</div>
          <div className={formData.nomineeName ? "pf-value-filled" : "pf-value-placeholder"}>{formData.nomineeName || '___'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Relationship with Applicant</div>
          <div className={formData.nomineeRelation ? "pf-value-filled" : "pf-value-placeholder"}>{formData.nomineeRelation || '___'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Nominee Date of Birth</div>
          <div className={formData.nomineeDob ? "pf-value-filled" : "pf-value-placeholder"}>{formData.nomineeDob ? formData.nomineeDob.split('-').reverse().join('/') : 'DD / MM / YYYY'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Nominee Mobile Number</div>
          <div className={formData.nomineePhone ? "pf-value-filled" : "pf-value-placeholder"}>{formData.nomineePhone ? '+91 ' + formData.nomineePhone : '+91 '}</div>
        </div>
      </div>

      {/* SECTION 5 */}
      <div className="pf-section-title">SECTION 5 — REFERRAL INFORMATION (if applicable)</div>
      <div className="pf-grid-2">
        <div className="pf-field">
          <div className="pf-label">Referred by (Name)</div>
          <div className={formData.referredBy ? "pf-value-filled" : "pf-value-placeholder"}>{formData.referredBy || '___'}</div>
        </div>
        <div className="pf-field">
          <div className="pf-label">Referral Code / ID</div>
          <div className={formData.referralCode ? "pf-value-filled" : "pf-value-placeholder"}>{formData.referralCode || '___'}</div>
        </div>
      </div>

      {/* SECTION 6 */}
      <div className="pf-section-title">SECTION 6 — TERMS AND CONDITIONS</div>
      <div className="pf-terms">
        <h4>1. Nature of Service</h4>
        <p>Javitri Trading Service ('the Company') provides advisory and portfolio management services. The expected daily returns stated in each plan are indicative estimates based on historical market performance and are not guaranteed.</p>
        
        <h4>2. Market Risk Disclosure</h4>
        <p>All investments in securities, commodities, and derivatives are subject to market risk. Past performance is not indicative of future results. The Client acknowledges that the value of investments may go up or down, and the Client may receive less than the amount originally invested.</p>

        <h4>3. Client Eligibility</h4>
        <p>The Client confirms that they are a citizen of India, at least 18 years of age, and possess the legal capacity to enter into a binding financial agreement. Any false declaration shall render this agreement void and may attract legal action.</p>

        <h4>4. KYC & Documentation</h4>
        <p>The Client agrees to provide valid KYC documents, including PAN card and Aadhaar card, as required under PMLA 2002 and SEBI regulations. The Company reserves the right to suspend services if valid KYC is not furnished within 7 working days.</p>

        <h4>5. Investment Lock-In Period</h4>
        <p>Each investment plan carries a minimum lock-in period as communicated at the time of enrolment. Early withdrawal requests will be processed subject to applicable charges and the Company's withdrawal policy in force at the time.</p>

        <h4>6. Payout Schedule</h4>
        <p>Daily returns are credited to the registered bank account / UPI on business days as per the payout schedule. The Company shall not be liable for delays caused by banking intermediaries, system outages, or force majeure events.</p>

        <h4>7. Referral Programme</h4>
        <p>Referral bonuses are governed by the Company's Referral Policy. Bonuses are non-transferable, non-encashable without meeting eligibility thresholds, and may be revised or discontinued at the Company's sole discretion with prior notice.</p>

        <h4>8. Confidentiality</h4>
        <p>All personal and financial information furnished by the Client shall be kept strictly confidential and used solely for the purpose of delivering the agreed services. The Company will not sell or share Client data with third parties except as required by law.</p>

        <h4>9. Dispute Resolution</h4>
        <p>Any dispute arising out of or in connection with this agreement shall first be referred to mediation. If unresolved within 30 days, the dispute shall be subject to the exclusive jurisdiction of the courts at Nashik, Maharashtra, India.</p>
      </div>

      <div className="page-break"></div>

      {/* HEADER ON PAGE 3 */}
      <div className="pf-header-container">
        <div className="pf-logo-col">
          <img src="/JT Logo 4.png" alt="Javitri Trading Service Logo" className="pf-logo" />
        </div>
        <div className="pf-header-bg">
          <h1 className="pf-header-title">JAVITRI TRADING SERVICE</h1>
          <h2 className="pf-header-subtitle">Client Investment Enrolment Form</h2>
          <p className="pf-header-address">© 2024 Javitri Trading Service • +91 90224 87800 • B.134 yogeshwar Nagar Sachin surat gujarat -394230</p>
        </div>
      </div>

      <div className="pf-terms">
        <h4>10. Governing Law</h4>
        <p>This agreement shall be governed by and construed in accordance with the laws of India, including but not limited to SEBI Act 1992, PMLA 2002, and the Indian Contract Act 1872.</p>

        <h4>11. Refund</h4>
        <p style={{ fontWeight: 'bold' }}>If for some reason the company and this project are closed, 100% of all investors' deposited money will be returned to you within 24 hours.</p>

        <h4>12. Amendments</h4>
        <p>The Company reserves the right to modify these terms with 15 days' prior written notice to the Client via the registered mobile number or email address.</p>
      </div>

      {/* SECTION 7 */}
      <div className="pf-section-title" style={{ marginTop: '30px' }}>SECTION 7 — DECLARATION & SIGNATURE</div>
      <p style={{ fontSize: '12px', color: '#000', lineHeight: '1.5', marginTop: '20px' }}>
        I, the undersigned, hereby declare that all information provided in this form is true, accurate, and complete to the best of my knowledge. I have read, understood, and voluntarily agree to be bound by the Terms and Conditions set out in Section 6 above. I acknowledge the risks associated with market investments and confirm that the funds invested are legitimate sources. I further authorise Javitri Trading Service to credit returns / payouts to the bank account / UPI ID specified in Section 3.
      </p>

      <div className="pf-sig-grid">
        <div className="pf-sig-box">
          <div className="pf-sig-title">Client's Signature / Thumb Impression</div>
          <div className="pf-sig-row">Name: <span className="pf-sig-line"></span></div>
          <div className="pf-sig-row">Date: <span className="pf-sig-line"></span></div>
        </div>
        <div className="pf-sig-box">
          <div className="pf-sig-title">FOR OFFICE USE ONLY</div>
          <div className="pf-sig-row">Verified by: <span className="pf-sig-line"></span></div>
          <div className="pf-sig-row">Employee ID: <span className="pf-sig-line"></span></div>
          <div className="pf-sig-row">Date of Processing: <span className="pf-sig-line"></span></div>
          <div className="pf-sig-row">
            Plan Activated: 
            <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pf-box"></span> Yes</span>
            <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pf-box"></span> No</span>
          </div>
          <div className="pf-sig-row">Remarks: <span className="pf-sig-line"></span></div>
        </div>
      </div>
    </div>
  );
}

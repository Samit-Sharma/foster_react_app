import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function OtpForm({ phone, dialCode, onVerify, onResend, onBack, loading, error, notice }) {
  const [otp, setOtp] = useState('123456');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function submit(event) {
    event.preventDefault();
    onVerify(otp);
  }

  return (
    <form onSubmit={submit} className="form-stack">
      <div className="sent-to">
        <span className="sent-icon"><CheckCircle2 size={18} /></span>
        <div>
          <div className="sent-label">OTP sent to</div>
          <strong>{dialCode} {phone}</strong>
        </div>
        <button type="button" className="text-button change-button" onClick={onBack}>Change</button>
      </div>
      <label className="field-label" htmlFor="otp">Enter 6-digit OTP</label>
      <input
        ref={inputRef}
        id="otp"
        className="input otp-input"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        aria-describedby="otp-hint"
        required
      />
      <div id="otp-hint" className="otp-hint"><ShieldCheck size={15} /> Demo OTP: <strong>123456</strong></div>
      {error && <p className="message error-message" role="alert">{error}</p>}
      {notice && <p className="message success-message" role="status">{notice}</p>}
      <button className="primary-button" type="submit" disabled={loading || otp.length !== 6}>
        {loading ? <><span className="spinner" /> Verifying…</> : <>Verify & continue <CheckCircle2 size={18} /></>}
      </button>
      <button type="button" className="secondary-button" onClick={onResend} disabled={loading}>Resend OTP</button>
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to phone number</button>
    </form>
  );
}

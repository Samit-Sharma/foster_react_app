import React, { useState } from 'react';
import { ArrowRight, Smartphone } from 'lucide-react';

export default function PhoneForm({ onSubmit, loading, error }) {
  const [phone, setPhone] = useState('9818979450');
  const [dialCode, setDialCode] = useState('+91');

  function submit(event) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return;
    onSubmit({ phone: digits, dialCode });
  }

  return (
    <form onSubmit={submit} className="form-stack">
      <label className="field-label" htmlFor="dial-code">Country code</label>
      <select id="dial-code" className="input" value={dialCode} onChange={(e) => setDialCode(e.target.value)}>
        <option value="+91">🇮🇳 India (+91)</option>
        <option value="+1">🇺🇸 United States (+1)</option>
        <option value="+44">🇬🇧 United Kingdom (+44)</option>
        <option value="+61">🇦🇺 Australia (+61)</option>
        <option value="+971">🇦🇪 UAE (+971)</option>
      </select>

      <label className="field-label" htmlFor="phone">Mobile number</label>
      <div className="phone-input-wrap">
        <Smartphone size={19} aria-hidden="true" />
        <input
          id="phone"
          className="phone-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s()-]/g, '').slice(0, 18))}
          placeholder="Enter mobile number"
          required
        />
      </div>
      {error && <p className="message error-message" role="alert">{error}</p>}
      <button className="primary-button" type="submit" disabled={loading || phone.replace(/\D/g, '').length < 7}>
        {loading ? <span className="spinner" /> : <>Send OTP <ArrowRight size={18} /></>}
      </button>
      <p className="fine-print">We’ll send a one-time password to your mobile number.</p>
    </form>
  );
}

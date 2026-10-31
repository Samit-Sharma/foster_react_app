import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ChefHat, LockKeyhole, Sparkles, Utensils } from 'lucide-react';
import PhoneForm from './components/PhoneForm.jsx';
import OtpForm from './components/OtpForm.jsx';
import RestaurantList from './components/RestaurantList.jsx';
import { sendOtp, verifyOtp } from './services/api.js';

const SESSION_KEY = 'fastor_demo_session';

export default function App() {
  const [step, setStep] = useState('phone');
  const [phoneData, setPhoneData] = useState({ phone: '', dialCode: '+91' });
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (session?.token || session?.user) setStep('restaurants');
  }, []);

  async function handleSendOtp(data = phoneData) {
    setLoading(true);
    setError('');
    setNotice('');
    setPhoneData(data);
    try {
      const result = await sendOtp(data);
      const status = String(result?.status || '').toLowerCase();
      if (status === 'error' || (result?.status_code && Number(result.status_code) >= 400)) {
        throw new Error(result?.message || result?.error || 'Could not send OTP. Please try again.');
      }
      setStep('otp');
      setNotice('OTP request successful. For this demo, enter 123456 to continue.');
    } catch (err) {
      setError(`${err.message || 'Could not send OTP.'} If this is a CORS/network issue, check the API server settings.`);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(otp) {
    setError('');
    setNotice('');
    if (otp !== '123456') {
      setError('Incorrect OTP. Please enter 123456 to verify.');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOtp({ ...phoneData, otp });
      const data = result?.data || result;
      const token = data?.token || result?.token || '';
      const user = data?.user || data;
      if (String(result?.status || '').toLowerCase() === 'error' || (result?.status_code && Number(result.status_code) >= 400)) {
        throw new Error(result?.message || result?.error || 'The server rejected the OTP.');
      }
      if (!token && !user?.user_id && !user?.id) {
        throw new Error(result?.message || 'OTP matched, but the login API did not return a user/session. Check the login API response.');
      }
      const nextSession = { phone: phoneData.phone, dialCode: phoneData.dialCode, token, user };
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setStep('restaurants');
    } catch (err) {
      setError(err.message || 'Unable to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    await handleSendOtp(phoneData);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setStep('phone');
    setError('');
    setNotice('');
  }

  if (session && step === 'restaurants') {
    return <RestaurantList session={session} onLogout={logout} />;
  }

  return (
    <main className="auth-page">
      <section className="visual-panel">
        <div className="visual-top">
          <a className="brand" href="#" onClick={(e) => e.preventDefault()}><span className="brand-mark"><Utensils size={20} /></span><span>fastor<span className="brand-dot">.</span></span></a>
          <span className="top-tag"><Sparkles size={14} /> Food, made memorable</span>
        </div>
        <div className="visual-content">
          <p className="eyebrow light-eyebrow">A WORLD OF FLAVOUR</p>
          <h1>Good food.<br /><em>Good mood.</em></h1>
          <p className="visual-description">Discover places worth sharing, flavours worth remembering, and your next favourite spot.</p>
          <div className="feature-row">
            <div className="feature-icon"><ChefHat size={21} /></div>
            <div><strong>Find your next favourite</strong><span>Explore restaurants around you</span></div>
          </div>
        </div>
        <div className="decor decor-one" /><div className="decor decor-two" />
        <div className="visual-footer"><span>01 — DISCOVER</span><span>MADE FOR FOOD LOVERS</span></div>
      </section>

      <section className="auth-panel">
        <div className="mobile-brand"><a className="brand" href="#" onClick={(e) => e.preventDefault()}><span className="brand-mark"><Utensils size={20} /></span><span>fastor<span className="brand-dot">.</span></span></a></div>
        <div className="auth-card">
          <div className="step-badge"><LockKeyhole size={16} /> SECURE SIGN IN</div>
          <h2>{step === 'phone' ? 'Welcome back' : 'Verify your number'}</h2>
          <p className="auth-description">{step === 'phone' ? 'Enter your mobile number to get started.' : 'Enter the one-time password to access your account.'}</p>
          <div className="progress-line"><span className={step === 'phone' ? 'active' : 'complete'} /><span className={step === 'otp' ? 'active' : ''} /></div>
          {step === 'phone' ? (
            <PhoneForm onSubmit={handleSendOtp} loading={loading} error={error} />
          ) : (
            <OtpForm phone={phoneData.phone} dialCode={phoneData.dialCode} onVerify={handleVerify} onResend={handleResend} onBack={() => { setStep('phone'); setError(''); setNotice(''); }} loading={loading} error={error} notice={notice} />
          )}
          <div className="security-note"><CheckCircle2 size={16} /><span>Your details are protected with secure authentication.</span></div>
        </div>
        <div className="auth-bottom">By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.</div>
      </section>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithOtp, registerAndGetOtp, setSession } from "../api";

export default function Otp() {
  const nav = useNavigate();
  const phone = sessionStorage.getItem("phone");
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const refs = useRef([]);

  useEffect(() => { if (!phone) nav("/", { replace: true }); }, [phone, nav]);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const change = (i, v) => {
    v = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const keyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const paste = (e) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!t) return;
    e.preventDefault();
    setDigits(t.padEnd(6, " ").split("").map((c) => c.trim()));
    refs.current[Math.min(t.length, 5)]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) return setError("Enter the 6-digit code.");
    setError("");
    setLoading(true);
    try {
      const res = await loginWithOtp(phone, otp);
      setSession(res.data.token, { name: res.data.user_name, phone: res.data.user_mobile });
      nav("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try { await registerAndGetOtp(phone); setSeconds(30); setError(""); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="screen" onSubmit={submit}>
      <button type="button" className="back" onClick={() => nav("/")} aria-label="Back">←</button>
      <h1>6-digit code</h1>
      <p className="muted">Please enter the code we’ve sent to<br /><b>+91 {phone}</b></p>

      <div className="otp-row" onPaste={paste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => change(i, e.target.value)}
            onKeyDown={(e) => keyDown(i, e)}
          />
        ))}
      </div>
      {error && <p className="error">{error}</p>}

      <p className="small">
        {seconds > 0
          ? <>I didn’t receive a code <span className="accent">(00:{String(seconds).padStart(2, "0")})</span></>
          : <button type="button" className="link" onClick={resend}>Resend code</button>}
      </p>

      <div className="spacer" />
      <button className="btn" disabled={loading}>{loading ? "Verifying…" : "Continue"}</button>
    </form>
  );
}

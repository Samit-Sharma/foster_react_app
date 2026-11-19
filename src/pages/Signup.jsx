import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAndGetOtp } from "../api";

export default function Signup() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.");
    setError("");
    setLoading(true);
    try {
      await registerAndGetOtp(phone);
      sessionStorage.setItem("phone", phone);
      nav("/otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="screen" onSubmit={submit}>
      <h1>Sign Up to Fastor</h1>
      <p className="muted">Let us know your mobile number and we will send you an OTP for verification.</p>

      <div className="phone-input">
        <span>+91</span>
        <input
          inputMode="numeric"
          maxLength={10}
          placeholder="00000 00000"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          aria-label="Mobile number"
          autoFocus
        />
      </div>
      {error && <p className="error">{error}</p>}

      <div className="spacer" />
      <button className="btn" disabled={loading}>{loading ? "Sending…" : "Get OTP"}</button>
      <p className="legal">By clicking, I accept the <b>Terms &amp; Conditions</b> and <b>Privacy Policy</b></p>
    </form>
  );
}

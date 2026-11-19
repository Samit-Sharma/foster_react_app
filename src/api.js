const BASE = "/api/v1"; // proxied to https://staging.fastor.ai

const form = (obj) => new URLSearchParams(obj).toString();

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status_code >= 400) {
    throw new Error(json.message || json.data || "Something went wrong. Try again.");
  }
  return json;
}

const post = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form(body),
  });

export const DIAL_CODE = "+91";

export const registerAndGetOtp = (phone) =>
  post("/pwa/user/register", { phone, dial_code: DIAL_CODE });

export const loginWithOtp = (phone, otp) =>
  post("/pwa/user/login", { phone, otp, dial_code: DIAL_CODE });

export const fetchRestaurants = (token, cityId = 118) =>
  request(`/m/restaurant?city_id=${cityId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getToken = () => localStorage.getItem("token");
export const setSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user || {}));
};
export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
};

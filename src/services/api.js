const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://staging.fastor.ai').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text || 'Unexpected response from server.' };
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Request failed (${response.status})`);
  }
  if (payload?.status && String(payload.status).toLowerCase() === 'error') {
    throw new Error(payload.message || payload.error || 'The API could not complete the request.');
  }
  return payload;
}

export function sendOtp({ phone, dialCode }) {
  return request('/v1/pwa/user/register', {
    method: 'POST',
    body: JSON.stringify({ phone, dial_code: dialCode }),
  });
}

export function verifyOtp({ phone, otp, dialCode }) {
  return request('/v1/pwa/user/login', {
    method: 'POST',
    body: JSON.stringify({ phone, otp, dial_code: dialCode }),
  });
}

export async function getRestaurants(token) {
  const cityId = import.meta.env.VITE_RESTAURANT_CITY_ID || '118';
  return request(`/v1/m/restaurant?city_id=${encodeURIComponent(cityId)}&&`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('typelearner_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function registerUser(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function loginUser(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchProfile() {
  return request('/auth/me');
}

export async function fetchProgress() {
  return request('/progress/me');
}

export async function completeLesson(lessonId) {
  return request('/progress/complete-lesson', { method: 'POST', body: JSON.stringify({ lessonId }) });
}

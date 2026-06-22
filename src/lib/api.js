/**
 * Dynamically resolves the API base URL at runtime.
 * Now using a relative path '/api' so it routes through the Load Balancer.
 */
const getApiBase = () => {
  // 1. Check if our runtime config exists
  if (window.ENV && window.ENV.VITE_API_URL) {
    return window.ENV.VITE_API_URL;
  }
  
  // 2. Pointing to /api so the ALB picks it up based on your routing rules
  return '/api';
};

function getToken() {
  return localStorage.getItem('typelearner_token');
}

/**
 * Standardized request helper
 */
async function request(path, options = {}) {
  const token = getToken();
  const url = `${getApiBase()}${path}`;
  
  const response = await fetch(url, {
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

// API Methods
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
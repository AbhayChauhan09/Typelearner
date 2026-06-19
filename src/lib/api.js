/**
 * Dynamically resolves the API base URL at runtime.
 * This ensures that even if the JS bundle is cached, the code 
 * will check window.ENV for the latest configuration.
 */
const getApiBase = () => {
  // 1. Check if our runtime config exists
  if (window.ENV && window.ENV.VITE_API_URL) {
    return window.ENV.VITE_API_URL;
  }
  
  // 2. If it doesn't exist, we force a check on the window object 
  // explicitly to bypass any build-time constants
  return 'http://18.212.243.128:3000/api';
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
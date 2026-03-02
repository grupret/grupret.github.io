// ─────────────────────────────────────────────────────────────────────────────
// Career Platform — Frontend Configuration
// Update API_BASE after deploying backend to Railway
// ─────────────────────────────────────────────────────────────────────────────

const CAREER_CONFIG = {
  // Backend URL — update this after Railway deployment
  // Local dev: 'http://localhost:3001'
  // Production: 'https://your-app.railway.app'
  API_BASE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://your-app.railway.app',  // ← Update this after Railway deploy

  GITHUB_USERNAME:  'grupret',
  LINKEDIN_URL:     'https://linkedin.com/in/gandhigurpreet',
  SITE_URL:         'https://grupret.github.io',

  // Feature flags
  FEATURES: {
    dynamicStats:   true,
    dynamicSEO:     true,
    dynamicPosts:   true,
    dynamicMarket:  true,
    adminPanel:     true
  }
};

// =============================================================================
// app.js — Dynamic Content Loader
// Fetches from backend API and hydrates the static portfolio with live data
// =============================================================================

(function () {
  'use strict';

  const BASE = (typeof CAREER_CONFIG !== 'undefined') ? CAREER_CONFIG.API_BASE : 'http://localhost:3001';
  const token = () => localStorage.getItem('career_token');

  async function apiFetch(path, opts = {}) {
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
        ...(opts.headers || {})
      }
    });
    if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
    return res.json();
  }

  // ── Run on DOM ready ────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', async () => {
    injectAdminNavLink();
    await Promise.allSettled([
      loadGitHubStats(),
      loadSEOMeta(),
      loadPublicPosts(),
      loadMarketData()
    ]);
    checkAuthState();
  });

  // ── GitHub Stats → Hero numbers ──────────────────────────────────────────────
  async function loadGitHubStats() {
    try {
      const data = await apiFetch('/api/stats/github');
      if (!data || data.error) return;

      // Update hero stat: "20+ Architectures" → real repo count
      const statItems = document.querySelectorAll('.stat-item');
      statItems.forEach(el => {
        const label = el.querySelector('.stat-label')?.textContent?.toLowerCase() || '';
        const num   = el.querySelector('.stat-number');
        if (label.includes('architectures') && data.publicRepos) {
          num.textContent = `${data.publicRepos}+`;
          el.querySelector('.stat-label').textContent = 'GitHub Repos';
        }
      });

      // Update GitHub card in assistant panel if open
      const ghEl = document.getElementById('githubStats');
      if (ghEl && window.assistant) window.assistant.renderGitHubFromApi(data);
    } catch { /* silently ignore — static fallback already in HTML */ }
  }

  // ── SEO — dynamic meta tags + JSON-LD ────────────────────────────────────────
  async function loadSEOMeta() {
    try {
      const seo = await apiFetch('/api/seo');
      if (!seo) return;

      // Update title
      if (seo.title) document.title = seo.title;

      // Update / create meta tags
      setMeta('description', seo.description);
      setMeta('keywords', seo.keywords?.join(', '));
      setOG('og:title', seo.title);
      setOG('og:description', seo.description);
      setOG('og:url', seo.canonical || CAREER_CONFIG.SITE_URL);
      if (seo.ogImage) setOG('og:image', seo.ogImage);

      // JSON-LD structured data
      injectJsonLd(seo);

      // Inject YouTube videos in learning section
      if (seo.youtubeVideos?.length) injectYouTubeVideos(seo.youtubeVideos);

      // Inject blog/article links in personal section
      if (seo.blogs?.length) injectBlogLinks(seo.blogs);

      // LinkedIn post references
      if (seo.linkedinPostRefs?.length) injectLinkedInRefs(seo.linkedinPostRefs);
    } catch { /* silently ignore */ }
  }

  // ── Public posts → Personal section ──────────────────────────────────────────
  async function loadPublicPosts() {
    try {
      const posts = await apiFetch('/api/posts');
      if (!posts?.length) return;
      injectPosts(posts);
    } catch { /* silently ignore */ }
  }

  // ── Market data → Career Hub role-match cards ─────────────────────────────────
  async function loadMarketData() {
    try {
      const market = await apiFetch('/api/market');
      if (!market || !market.totalJobsTracked) return;

      // Add live market stats below role-match grid
      const careerSection = document.getElementById('career');
      if (!careerSection) return;

      const existing = careerSection.querySelector('.market-live-stats');
      if (existing) existing.remove();

      const el = document.createElement('div');
      el.className = 'market-live-stats';
      el.style.cssText = 'text-align:center;padding:16px 0;color:#64748b;font-size:13px';
      el.innerHTML = `
        <span style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:20px;padding:6px 16px;color:#a5b4fc;font-weight:600">
          📊 ${market.totalJobsTracked} jobs tracked · ${market.avgProfileMatch}% avg match ·
          ${market.trending?.slice(0,3).map(t => t.skill).join(' · ')}
        </span>`;
      careerSection.querySelector('.container')?.appendChild(el);
    } catch { /* silently ignore */ }
  }

  // ── Auth state ────────────────────────────────────────────────────────────────
  function checkAuthState() {
    const t = token();
    if (!t) return;
    // Validate token
    apiFetch('/api/auth/me').then(() => {
      showAdminLink();
    }).catch(() => {
      localStorage.removeItem('career_token');
    });
  }

  function injectAdminNavLink() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    // Add login/admin link if not already present
    if (!navMenu.querySelector('.admin-nav-link')) {
      const link = document.createElement('a');
      link.href = '/admin.html';
      link.className = 'nav-link admin-nav-link';
      link.id = 'adminNavLink';
      link.style.display = 'none';
      link.innerHTML = '⚙️ Admin';
      navMenu.appendChild(link);

      const loginLink = document.createElement('a');
      loginLink.href = '#';
      loginLink.className = 'nav-link';
      loginLink.id = 'loginNavLink';
      loginLink.innerHTML = '🔐 Login';
      loginLink.onclick = (e) => { e.preventDefault(); showLoginModal(); };
      navMenu.appendChild(loginLink);
    }
  }

  function showAdminLink() {
    document.getElementById('adminNavLink')?.style && (document.getElementById('adminNavLink').style.display = '');
    const loginLink = document.getElementById('loginNavLink');
    if (loginLink) {
      loginLink.innerHTML = '🔓 Logout';
      loginLink.onclick = (e) => { e.preventDefault(); localStorage.removeItem('career_token'); location.reload(); };
    }
  }

  function showLoginModal() {
    const existing = document.getElementById('loginModal');
    if (existing) { existing.style.display = 'flex'; return; }

    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    modal.innerHTML = `
      <div style="background:#1a1a2e;border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:32px;width:360px;max-width:90vw">
        <h3 style="color:#e2e8f0;font-size:20px;margin-bottom:8px;font-family:Inter,sans-serif">🔐 Admin Login</h3>
        <p style="color:#64748b;font-size:13px;margin-bottom:24px;font-family:Inter,sans-serif">Career platform admin access</p>
        <input id="loginPassword" type="password" placeholder="Password" autofocus
          style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:12px 16px;color:#e2e8f0;font-size:14px;margin-bottom:12px;box-sizing:border-box;font-family:Inter,sans-serif"
          onkeydown="if(event.key==='Enter')document.getElementById('loginBtn').click()">
        <p id="loginError" style="color:#f87171;font-size:12px;display:none;margin-bottom:8px;font-family:Inter,sans-serif"></p>
        <div style="display:flex;gap:8px">
          <button id="loginBtn" onclick="window.careerLogin()" style="flex:1;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;color:#fff;padding:12px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">Login</button>
          <button onclick="document.getElementById('loginModal').style.display='none'" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#94a3b8;padding:12px;border-radius:8px;font-size:14px;cursor:pointer;font-family:Inter,sans-serif">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  window.careerLogin = async function () {
    const pw  = document.getElementById('loginPassword')?.value;
    const err = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    if (!pw) return;
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    try {
      const data = await apiFetch('/api/auth/login', { method:'POST', body: JSON.stringify({ password: pw }) });
      localStorage.setItem('career_token', data.token);
      document.getElementById('loginModal').style.display = 'none';
      showAdminLink();
    } catch {
      err.textContent = 'Invalid password. Try again.';
      err.style.display = 'block';
      btn.textContent = 'Login';
      btn.disabled = false;
    }
  };

  // ── DOM helpers ───────────────────────────────────────────────────────────────
  function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = content;
  }

  function setOG(property, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
    el.content = content;
  }

  function injectJsonLd(seo) {
    const existing = document.getElementById('jsonLdPerson');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonLdPerson';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Gurpreet Gandhi',
      jobTitle: 'VP of Platform Engineering',
      description: seo.description,
      url: seo.canonical || 'https://grupret.github.io',
      sameAs: ['https://github.com/grupret', 'https://linkedin.com/in/gandhigurpreet'],
      knowsAbout: seo.keywords || [],
      alumniOf: { '@type': 'Organization', name: 'Platform Engineering Community' }
    });
    document.head.appendChild(script);
  }

  function injectYouTubeVideos(videos) {
    const target = document.getElementById('yt-videos-section') ||
      (() => {
        const el = document.createElement('div');
        el.id = 'yt-videos-section';
        el.style.cssText = 'margin-top:32px';
        document.querySelector('#personal .container')?.appendChild(el);
        return el;
      })();

    target.innerHTML = `
      <h3 style="font-size:1.3rem;font-weight:700;color:#1a1a2e;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <i class="fab fa-youtube" style="color:#ff0000"></i> Featured Videos
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
        ${videos.slice(0, 6).map(v => `
          <div style="border-radius:12px;overflow:hidden;background:#f8fafc;border:1px solid #e2e8f0">
            <div style="position:relative;padding-top:56.25%">
              <iframe style="position:absolute;inset:0;width:100%;height:100%" src="${v.embedUrl}" title="${v.title}" frameborder="0" loading="lazy" allowfullscreen></iframe>
            </div>
            <div style="padding:12px">
              <p style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:4px">${v.title}</p>
              <p style="font-size:12px;color:#64748b">${v.description || ''}</p>
            </div>
          </div>`).join('')}
      </div>`;
  }

  function injectBlogLinks(blogs) {
    const target = document.getElementById('blog-links-section') ||
      (() => {
        const el = document.createElement('div');
        el.id = 'blog-links-section';
        document.querySelector('#personal .container')?.appendChild(el);
        return el;
      })();

    target.innerHTML = `
      <h3 style="font-size:1.3rem;font-weight:700;color:#1a1a2e;margin:32px 0 16px;display:flex;align-items:center;gap:8px">
        <i class="fas fa-pen-alt" style="color:#6366f1"></i> Articles & Writing
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
        ${blogs.map(b => `
          <a href="${b.url}" target="_blank" style="display:block;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;transition:all 0.2s" onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='#e2e8f0'">
            <div style="font-weight:600;color:#1a1a2e;font-size:14px;margin-bottom:4px">${b.title}</div>
            <div style="font-size:12px;color:#64748b">${b.description || ''}</div>
            ${b.tags?.length ? `<div style="margin-top:8px">${b.tags.map(t => `<span style="background:#ede9fe;color:#6366f1;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:600;margin-right:4px">${t}</span>`).join('')}</div>` : ''}
          </a>`).join('')}
      </div>`;
  }

  function injectLinkedInRefs(refs) {
    const target = document.getElementById('li-refs-section') ||
      (() => {
        const el = document.createElement('div');
        el.id = 'li-refs-section';
        document.querySelector('#personal .container')?.appendChild(el);
        return el;
      })();

    target.innerHTML = `
      <h3 style="font-size:1.3rem;font-weight:700;color:#1a1a2e;margin:32px 0 16px;display:flex;align-items:center;gap:8px">
        <i class="fab fa-linkedin" style="color:#0a66c2"></i> LinkedIn Insights
      </h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${refs.map(r => `
          <a href="${r.url}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:#f0f7ff;border:1px solid #0a66c2;border-radius:8px;text-decoration:none;color:#0a66c2;font-size:13px;font-weight:600">
            <i class="fab fa-linkedin"></i> ${r.topic || 'View Post'}
          </a>`).join('')}
      </div>`;
  }

  function injectPosts(posts) {
    if (!posts.length) return;
    const target = document.getElementById('dynamic-posts-section') ||
      (() => {
        const el = document.createElement('div');
        el.id = 'dynamic-posts-section';
        el.className = 'personal-section';
        document.querySelector('#personal .container')?.prepend(el);
        return el;
      })();

    target.innerHTML = `
      <h3 class="personal-title" style="display:flex;align-items:center;gap:10px">
        <i class="fas fa-rss" style="color:#6366f1"></i> Latest Posts
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:16px">
        ${posts.slice(0, 6).map(p => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px">
            ${p.title ? `<h4 style="font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:8px">${p.title}</h4>` : ''}
            <p style="font-size:13px;color:#475569;line-height:1.6">${p.content?.slice(0, 200)}${p.content?.length > 200 ? '...' : ''}</p>
            ${p.tags?.length ? `<div style="margin-top:10px">${p.tags.map(t => `<span style="background:#ede9fe;color:#6366f1;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:600;margin-right:4px">${t}</span>`).join('')}</div>` : ''}
            <div style="margin-top:10px;font-size:11px;color:#94a3b8">${new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</div>
          </div>`).join('')}
      </div>`;
  }

})();

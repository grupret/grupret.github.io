'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   Admin Panel — Career Platform
   Handles all admin UI interactions, API calls, state management
───────────────────────────────────────────────────────────────────────────── */

// ── Token helpers ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'career_token';
const getToken  = () => localStorage.getItem(TOKEN_KEY);
const setToken  = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ── API helper ───────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${CAREER_CONFIG.API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers
    },
    ...opts
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

// ── Toast notifications ───────────────────────────────────────────────────────
function toast(msg, type = 'info', duration = 3000) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── Clock ─────────────────────────────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('topbar-time');
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function adminLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');
  const pw = document.getElementById('password-input').value;

  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Signing in…';
  errEl.classList.add('hidden');

  try {
    const { token } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: pw })
    });
    setToken(token);
    bootAdmin();
  } catch (err) {
    errEl.textContent = err.message || 'Invalid password';
    errEl.classList.remove('hidden');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Sign In';
  }
}

function adminLogout() {
  clearToken();
  document.getElementById('admin-shell').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function bootAdmin() {
  // Verify token
  try {
    await api('/api/auth/me');
  } catch (_) {
    clearToken();
    return; // stay on login
  }

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-shell').classList.remove('hidden');

  startClock();
  checkBackendStatus();

  // Boot current section
  const hash = (location.hash || '#dashboard').replace('#', '');
  Admin.showSection(hash, false);
  Admin.loadDashboard();

  // Nav click handling
  document.querySelectorAll('.nav-item[data-section]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      Admin.showSection(a.dataset.section);
    });
  });
}

async function checkBackendStatus() {
  const dot = document.querySelector('.status-dot');
  const label = document.querySelector('.topbar-status span:last-child');
  try {
    await fetch(`${CAREER_CONFIG.API_BASE}/health`);
    dot.className = 'status-dot online';
    label.textContent = 'Backend Online';
  } catch (_) {
    dot.className = 'status-dot offline';
    label.textContent = 'Backend Offline';
  }
}

// ── Sidebar toggle ────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('admin-sidebar').classList.toggle('open');
}

// ── Reveal secret ─────────────────────────────────────────────────────────────
function toggleReveal(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

// ── Schedule toggle ───────────────────────────────────────────────────────────
function toggleSchedule(radio) {
  const dt = document.getElementById('post-schedule-dt');
  dt.classList.toggle('hidden', radio.value !== 'scheduled');
}

// ── Admin object ─────────────────────────────────────────────────────────────
const Admin = {

  // ── State ──
  _state: {
    jobs: [],
    currentJobId: null,
    posts: [],
    exclusions: { companies: [], people: [], keywords: [], knownConnections: [] },
    postRefs: []
  },

  // ── Sections ──
  showSection(name, push = true) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));

    const section = document.getElementById(`section-${name}`);
    if (section) section.classList.remove('hidden');

    const navItem = document.querySelector(`.nav-item[data-section="${name}"]`);
    if (navItem) navItem.classList.add('active');

    const titles = {
      dashboard: 'Dashboard', jobs: 'Job Hunt', posts: 'Posts',
      learning: 'Learning Plan', seo: 'SEO', exclusions: 'Exclusions',
      apikeys: 'API Keys', crons: 'Cron Status'
    };
    document.getElementById('page-title').textContent = titles[name] || name;

    if (push) location.hash = name;

    const loaders = {
      dashboard: () => this.loadDashboard(),
      jobs: () => this.loadJobs(),
      posts: () => this.loadPosts(),
      learning: () => this.loadLearning(),
      seo: () => this.loadSEO(),
      exclusions: () => this.loadExclusions(),
      apikeys: () => this.loadApiKeys(),
      crons: () => this.loadCronStatus()
    };
    if (loaders[name]) loaders[name]();
  },

  // ── Dashboard ──
  async loadDashboard() {
    try {
      const [jobsData, postsData, learningData, githubData, leetData] = await Promise.allSettled([
        api('/api/jobs?status=new'),
        api('/api/posts'),
        api('/api/learning'),
        api('/api/stats/github'),
        api('/api/stats/leetcode')
      ]);

      if (jobsData.status === 'fulfilled') {
        const newJobs = (jobsData.value.jobs || []).filter(j => j.status === 'new').length;
        document.getElementById('dash-jobs-new').textContent = newJobs;
        document.getElementById('jobs-badge').textContent = newJobs;
      }
      if (postsData.status === 'fulfilled') {
        const published = (postsData.value.posts || []).filter(p => p.status === 'published').length;
        document.getElementById('dash-posts').textContent = published;
      }
      if (learningData.status === 'fulfilled') {
        document.getElementById('dash-streak').textContent = learningData.value.streak || 0;
      }
      if (githubData.status === 'fulfilled') {
        document.getElementById('dash-repos').textContent = githubData.value.publicRepos || '—';
      }
      if (leetData.status === 'fulfilled') {
        document.getElementById('dash-leet').textContent = leetData.value.totalSolved || '—';
      }

      // Applications this week (count from jobs with status 'applied')
      if (jobsData.status === 'fulfilled') {
        const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const sent = (jobsData.value.jobs || []).filter(j => j.status === 'applied' && new Date(j.appliedAt) > week).length;
        document.getElementById('dash-apps-sent').textContent = sent;
      }

      await this.loadMarketSnapshot();
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  },

  async loadMarketSnapshot() {
    const el = document.getElementById('dash-market');
    try {
      const data = await api('/api/market');
      if (!data.trending || !data.trending.length) {
        el.innerHTML = '<div class="loading-text">No market data yet — run scrape first</div>';
        return;
      }
      el.innerHTML = data.trending.slice(0, 8).map(s => `
        <div class="market-row">
          <span class="market-skill">${s.skill} ${s.inMyProfile ? '✓' : ''}</span>
          <span class="market-count">${s.count} jobs</span>
        </div>
      `).join('');
    } catch (_) {
      el.innerHTML = '<div class="loading-text">Market data unavailable</div>';
    }
  },

  async refreshMarket() {
    toast('Refreshing market analysis…', 'info');
    try {
      await api('/api/market/refresh', { method: 'POST' });
      toast('Market analysis updated', 'success');
      await this.loadMarketSnapshot();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async refreshStats(type) {
    toast('Refreshing stats…', 'info');
    try {
      await api('/api/stats/refresh', { method: 'POST' });
      toast('Stats refreshed successfully', 'success');
      this.loadCronStatus();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async recordStreak() {
    try {
      const data = await api('/api/learning/streak', { method: 'POST' });
      const streakEl = document.getElementById('learning-streak');
      if (streakEl) streakEl.textContent = data.streak;
      document.getElementById('dash-streak').textContent = data.streak;
      toast(`Streak recorded! ${data.streak} days 🔥`, 'success');
    } catch (err) {
      toast(err.message || 'Already recorded today', 'error');
    }
  },

  // ── Jobs ──
  async loadJobs() {
    const el = document.getElementById('jobs-list');
    el.innerHTML = '<div class="loading-text">Loading jobs…</div>';

    const status = document.getElementById('job-filter-status')?.value || '';
    const minScore = document.getElementById('job-filter-score')?.value || '';
    const search = document.getElementById('job-filter-search')?.value || '';

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (minScore) params.set('minScore', minScore);
    if (search) params.set('search', search);

    try {
      const data = await api(`/api/jobs?${params}`);
      this._state.jobs = data.jobs || [];

      if (!this._state.jobs.length) {
        el.innerHTML = '<div class="loading-text">No jobs found — try scraping or adjusting filters</div>';
        return;
      }

      el.innerHTML = this._state.jobs.map(j => this._renderJobCard(j)).join('');

      el.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => this.openJobModal(card.dataset.id));
      });
    } catch (err) {
      el.innerHTML = `<div class="loading-text" style="color:var(--danger)">${err.message}</div>`;
    }
  },

  _renderJobCard(j) {
    const scoreClass = j.score >= 70 ? 'high' : j.score >= 40 ? 'medium' : 'low';
    const statusClass = `status-${j.status || 'new'}`;
    return `
      <div class="job-card" data-id="${j.id}">
        <div class="job-card-left">
          <div class="job-title">${j.title}</div>
          <div class="job-company">${j.company}${j.location ? ' · ' + j.location : ''}</div>
          <div class="job-meta">
            ${j.easyApply ? '<span class="job-tag">Easy Apply</span>' : ''}
            ${j.source ? `<span class="job-tag">${j.source}</span>` : ''}
            <span class="job-tag">${new Date(j.scrapedAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="job-card-right">
          <div class="job-score ${scoreClass}">${j.score || 0}</div>
          <span class="job-status-badge ${statusClass}">${j.status || 'new'}</span>
        </div>
      </div>
    `;
  },

  openJobModal(id) {
    const job = this._state.jobs.find(j => j.id === id);
    if (!job) return;
    this._state.currentJobId = id;

    document.getElementById('job-modal-title').textContent = `${job.title} — ${job.company}`;
    document.getElementById('job-modal-body').innerHTML = `
      <div class="job-detail-section">
        <h4>Job Info</h4>
        <p><strong>Location:</strong> ${job.location || '—'}<br>
           <strong>Source:</strong> ${job.source || '—'}<br>
           <strong>Score:</strong> ${job.score || 0}/100<br>
           <strong>Status:</strong> ${job.status || 'new'}<br>
           ${job.url ? `<strong>URL:</strong> <a href="${job.url}" target="_blank" style="color:var(--accent)">${job.url}</a>` : ''}</p>
      </div>
      <div class="job-detail-section">
        <h4>Description</h4>
        <p>${(job.description || 'No description available').replace(/\n/g, '<br>')}</p>
      </div>
      ${job.generated ? `
      <div class="job-detail-section">
        <h4>Generated Resume</h4>
        <div class="generated-output">${job.generated.resume || ''}</div>
        <h4 style="margin-top:12px">Cover Letter</h4>
        <div class="generated-output">${job.generated.coverLetter || ''}</div>
      </div>
      ` : ''}
    `;

    document.getElementById('job-modal').classList.remove('hidden');
  },

  closeJobModal() {
    document.getElementById('job-modal').classList.add('hidden');
    this._state.currentJobId = null;
  },

  async generateResume() {
    const id = this._state.currentJobId;
    const btn = document.getElementById('job-generate-btn');
    btn.disabled = true;
    btn.textContent = 'Generating…';
    toast('Generating resume + cover letter with Claude…', 'info', 8000);

    try {
      const data = await api(`/api/jobs/${id}/generate`, { method: 'POST' });
      // Reload job to get generated content
      const updated = await api(`/api/jobs/${id}`);
      const jobs = this._state.jobs;
      const idx = jobs.findIndex(j => j.id === id);
      if (idx >= 0) jobs[idx] = updated.job;
      this.openJobModal(id);
      toast('Resume + cover letter generated!', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate Resume + Cover Letter';
    }
  },

  async applyJob() {
    const id = this._state.currentJobId;
    try {
      await api(`/api/jobs/${id}/apply`, { method: 'POST' });
      toast('Application logged! Check LinkedIn to complete.', 'success');
      this.closeJobModal();
      this.loadJobs();
    } catch (err) {
      if (err.status === 403) toast('🚫 Job blocked by exclusion list!', 'error', 5000);
      else toast(err.message, 'error');
    }
  },

  async skipJob() {
    const id = this._state.currentJobId;
    try {
      await api(`/api/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'skipped' })
      });
      toast('Job skipped', 'info');
      this.closeJobModal();
      this.loadJobs();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async triggerJobSearch() {
    toast('LinkedIn job scrape started in background…', 'info', 5000);
    try {
      await api('/api/jobs/search', { method: 'POST' });
      toast('Scrape complete — reloading jobs', 'success');
      setTimeout(() => this.loadJobs(), 2000);
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── Posts ──
  async loadPosts() {
    const el = document.getElementById('posts-list');
    el.innerHTML = '<div class="loading-text">Loading posts…</div>';
    try {
      const data = await api('/api/posts');
      this._state.posts = data.posts || [];

      if (!this._state.posts.length) {
        el.innerHTML = '<div class="loading-text">No posts yet</div>';
        return;
      }

      el.innerHTML = this._state.posts.map(p => `
        <div class="post-item">
          <div class="post-item-header">
            <div class="post-item-title">${p.title || '(Untitled)'}</div>
            <div class="post-item-meta">
              <span class="job-status-badge ${p.status === 'published' ? 'status-applied' : 'status-reviewing'}">
                ${p.status}
              </span>
            </div>
          </div>
          <div class="post-item-body">${p.content || ''}</div>
          <div class="post-actions">
            <button class="btn btn-sm btn-secondary" onclick="Admin.editPost('${p.id}')">Edit</button>
            ${p.status !== 'published' ? `<button class="btn btn-sm btn-primary" onclick="Admin.publishPost('${p.id}')">Publish to LinkedIn</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="Admin.deletePost('${p.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    } catch (err) {
      el.innerHTML = `<div class="loading-text" style="color:var(--danger)">${err.message}</div>`;
    }
  },

  editPost(id) {
    const post = this._state.posts.find(p => p.id === id);
    if (!post) return;
    document.getElementById('post-edit-id').value = id;
    document.getElementById('post-title').value = post.title || '';
    document.getElementById('post-content').value = post.content || '';
    document.getElementById('post-composer-title').textContent = 'Edit Post';
    this._state.postRefs = post.linkedinRefs || [];
    this._renderPostRefs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  resetPostForm() {
    document.getElementById('post-edit-id').value = '';
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-composer-title').textContent = 'New Post';
    this._state.postRefs = [];
    this._renderPostRefs();
  },

  addPostRef() {
    const input = document.getElementById('post-ref-input');
    const url = input.value.trim();
    if (!url) return;
    this._state.postRefs.push(url);
    this._renderPostRefs();
    input.value = '';
  },

  removePostRef(idx) {
    this._state.postRefs.splice(idx, 1);
    this._renderPostRefs();
  },

  _renderPostRefs() {
    document.getElementById('post-refs-list').innerHTML = this._state.postRefs.map((r, i) => `
      <div class="tag-chip">
        <span>${r.length > 50 ? r.slice(0, 50) + '…' : r}</span>
        <button onclick="Admin.removePostRef(${i})">×</button>
      </div>
    `).join('');
  },

  async savePost(action) {
    const editId = document.getElementById('post-edit-id').value;
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const scheduleType = document.querySelector('input[name="post-schedule"]:checked')?.value || 'draft';
    const scheduledAt = scheduleType === 'scheduled' ? document.getElementById('post-schedule-dt').value : null;

    if (!content) { toast('Post content is required', 'error'); return; }

    const payload = {
      title, content,
      linkedinRefs: this._state.postRefs,
      status: action === 'publish' ? 'published' : scheduleType === 'draft' ? 'draft' : 'scheduled',
      scheduledAt
    };

    try {
      if (editId) {
        await api(`/api/posts/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        const data = await api('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
        if (action === 'publish' && data.post?.id) {
          await this.publishPost(data.post.id);
          return;
        }
      }

      if (action === 'publish' && editId) {
        await this.publishPost(editId);
        return;
      }

      toast(editId ? 'Post updated' : 'Post saved', 'success');
      this.resetPostForm();
      this.loadPosts();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async publishPost(id) {
    toast('Publishing to LinkedIn…', 'info', 5000);
    try {
      await api(`/api/posts/${id}/publish`, { method: 'POST' });
      toast('Published to LinkedIn!', 'success');
      this.resetPostForm();
      this.loadPosts();
    } catch (err) {
      toast(err.message || 'LinkedIn publish failed', 'error');
    }
  },

  async deletePost(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await api(`/api/posts/${id}`, { method: 'DELETE' });
      toast('Post deleted', 'success');
      this.loadPosts();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── Learning ──
  async loadLearning() {
    try {
      const data = await api('/api/learning');
      document.getElementById('learning-streak').textContent = data.streak || 0;
      this._renderPlanList(data.plan || []);
      this._renderCoursesList(data.courses || []);
    } catch (err) {
      toast('Failed to load learning data', 'error');
    }
  },

  _renderPlanList(plan) {
    const el = document.getElementById('plan-list');
    if (!plan.length) {
      el.innerHTML = '<div class="loading-text">No plan items yet</div>';
      return;
    }
    el.innerHTML = plan.map(item => `
      <div class="plan-item ${item.completed ? 'done' : ''}">
        <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="Admin.togglePlanItem('${item.id}', this.checked)" />
        <div class="plan-item-content">
          <div class="plan-item-title">${item.title}</div>
          <div class="plan-item-meta">${item.domain} · ${item.type}${item.targetDate ? ' · Due ' + item.targetDate : ''}</div>
        </div>
        <div class="plan-item-actions">
          ${item.url ? `<a href="${item.url}" target="_blank" class="btn btn-sm btn-secondary">Open</a>` : ''}
          <button class="btn btn-sm btn-danger" onclick="Admin.deletePlanItem('${item.id}')">×</button>
        </div>
      </div>
    `).join('');
  },

  _renderCoursesList(courses) {
    const el = document.getElementById('courses-list');
    if (!courses.length) {
      el.innerHTML = '<div class="loading-text">No course progress tracked</div>';
      return;
    }
    el.innerHTML = courses.map(c => `
      <div class="course-item">
        <div class="course-name">${c.name}</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${c.progress || 0}%"></div></div>
        <div class="progress-label">${c.progress || 0}% complete${c.completedAt ? ' · Done ' + c.completedAt : ''}</div>
      </div>
    `).join('');
  },

  async togglePlanItem(id, completed) {
    try {
      await api(`/api/learning/plan/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) });
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async deletePlanItem(id) {
    try {
      await api(`/api/learning/plan/${id}`, { method: 'DELETE' });
      toast('Item removed', 'success');
      this.loadLearning();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  showPlanModal() { document.getElementById('plan-modal').classList.remove('hidden'); },
  addPlanItem()   { this.showPlanModal(); },

  closePlanModal() { document.getElementById('plan-modal').classList.add('hidden'); },

  async savePlanItem() {
    const title  = document.getElementById('plan-item-title').value.trim();
    const type   = document.getElementById('plan-item-type').value;
    const domain = document.getElementById('plan-item-domain').value;
    const url    = document.getElementById('plan-item-url').value.trim();
    const date   = document.getElementById('plan-item-date').value;

    if (!title) { toast('Title is required', 'error'); return; }

    try {
      await api('/api/learning/plan', { method: 'POST', body: JSON.stringify({ title, type, domain, url, targetDate: date }) });
      toast('Plan item added', 'success');
      this.closePlanModal();
      this.loadLearning();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async addCourseProgress() {
    const name     = prompt('Course name:');
    if (!name) return;
    const progress = parseInt(prompt('Progress % (0-100):') || '0', 10);
    try {
      await api('/api/learning/progress', { method: 'PUT', body: JSON.stringify({ name, progress }) });
      toast('Course progress saved', 'success');
      this.loadLearning();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── SEO ──
  async loadSEO() {
    try {
      const data = await api('/api/seo');
      document.getElementById('seo-title').value = data.title || '';
      document.getElementById('seo-description').value = data.description || '';
      document.getElementById('seo-keywords').value = (data.keywords || []).join(', ');
      this._renderVideosList(data.youtubeVideos || []);
      this._renderBlogsList(data.blogs || []);
      this._renderLinkedInRefsList(data.linkedinPostRefs || []);
    } catch (err) {
      toast('Failed to load SEO data', 'error');
    }
  },

  async saveSEOMeta() {
    const payload = {
      title: document.getElementById('seo-title').value.trim(),
      description: document.getElementById('seo-description').value.trim(),
      keywords: document.getElementById('seo-keywords').value.split(',').map(k => k.trim()).filter(Boolean)
    };
    try {
      await api('/api/seo', { method: 'PUT', body: JSON.stringify(payload) });
      toast('SEO meta saved', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  _renderVideosList(videos) {
    const el = document.getElementById('seo-videos-list');
    el.innerHTML = videos.map(v => `
      <div class="media-item">
        <div class="media-item-info">
          <div class="media-item-title">${v.title}</div>
          <div class="media-item-url">${v.embedUrl || v.videoId}</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="Admin.deleteVideo('${v.id}')">×</button>
      </div>
    `).join('') || '<div class="loading-text">No videos added</div>';
  },

  async addVideo() {
    const raw   = document.getElementById('seo-video-id').value.trim();
    const title = document.getElementById('seo-video-title').value.trim();
    if (!raw) return;
    // Extract ID from URL if needed
    const match = raw.match(/[?&]v=([^&]+)/) || raw.match(/youtu\.be\/([^?]+)/);
    const videoId = match ? match[1] : raw;
    try {
      await api('/api/seo/videos', { method: 'POST', body: JSON.stringify({ videoId, title }) });
      toast('Video added', 'success');
      document.getElementById('seo-video-id').value = '';
      document.getElementById('seo-video-title').value = '';
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async deleteVideo(id) {
    try {
      await api(`/api/seo/videos/${id}`, { method: 'DELETE' });
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  _renderBlogsList(blogs) {
    const el = document.getElementById('seo-blogs-list');
    el.innerHTML = blogs.map(b => `
      <div class="media-item">
        <div class="media-item-info">
          <div class="media-item-title">${b.title}</div>
          <div class="media-item-url">${b.url}</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="Admin.deleteBlog('${b.id}')">×</button>
      </div>
    `).join('') || '<div class="loading-text">No blogs added</div>';
  },

  async addBlog() {
    const url   = document.getElementById('seo-blog-url').value.trim();
    const title = document.getElementById('seo-blog-title').value.trim();
    if (!url) return;
    try {
      await api('/api/seo/blogs', { method: 'POST', body: JSON.stringify({ url, title }) });
      toast('Blog reference added', 'success');
      document.getElementById('seo-blog-url').value = '';
      document.getElementById('seo-blog-title').value = '';
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async deleteBlog(id) {
    try {
      await api(`/api/seo/blogs/${id}`, { method: 'DELETE' });
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  _renderLinkedInRefsList(refs) {
    const el = document.getElementById('seo-linkedin-list');
    el.innerHTML = refs.map(r => `
      <div class="media-item">
        <div class="media-item-info">
          <div class="media-item-title">${r.label || r.url}</div>
          <div class="media-item-url">${r.url}</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="Admin.deleteLinkedInRef('${r.id}')">×</button>
      </div>
    `).join('') || '<div class="loading-text">No LinkedIn references added</div>';
  },

  async addLinkedInRef() {
    const url   = document.getElementById('seo-linkedin-url').value.trim();
    const label = document.getElementById('seo-linkedin-label').value.trim();
    if (!url) return;
    try {
      await api('/api/seo/linkedin-refs', { method: 'POST', body: JSON.stringify({ url, label }) });
      toast('LinkedIn reference added', 'success');
      document.getElementById('seo-linkedin-url').value = '';
      document.getElementById('seo-linkedin-label').value = '';
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async deleteLinkedInRef(id) {
    try {
      await api(`/api/seo/linkedin-refs/${id}`, { method: 'DELETE' });
      this.loadSEO();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── Exclusions ──
  async loadExclusions() {
    try {
      const data = await api('/api/config/exclusions');
      this._state.exclusions = data.exclusions || { companies: [], people: [], keywords: [], knownConnections: [] };
      this._renderExclusionList('excl-companies', this._state.exclusions.companies, 'companies');
      this._renderExclusionList('excl-people', this._state.exclusions.people, 'people');
      this._renderExclusionList('excl-keywords', this._state.exclusions.keywords, 'keywords');
      this._renderExclusionList('excl-connections', this._state.exclusions.knownConnections, 'knownConnections');
    } catch (err) {
      toast('Failed to load exclusions', 'error');
    }
  },

  _renderExclusionList(elId, items, type) {
    const el = document.getElementById(elId);
    el.innerHTML = items.map(item => `
      <div class="excl-item">
        <span class="excl-item-name">${item}</span>
        <button onclick="Admin.removeExclusion('${type}', '${item.replace(/'/g, "\\'")}')" title="Remove">×</button>
      </div>
    `).join('') || '<div style="color:var(--text-muted);font-size:12px;padding:8px 0">None added</div>';
  },

  async addExclusion(type, inputId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    if (!value) return;
    try {
      await api('/api/config/exclusions/add', { method: 'POST', body: JSON.stringify({ type, value }) });
      input.value = '';
      toast(`Added to ${type}`, 'success');
      this.loadExclusions();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async removeExclusion(type, value) {
    try {
      await api('/api/config/exclusions/remove', {
        method: 'DELETE',
        body: JSON.stringify({ type, value })
      });
      toast('Removed', 'success');
      this.loadExclusions();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── API Keys ──
  async loadApiKeys() {
    try {
      const data = await api('/api/config');
      const cfg = data.config?.integrations || {};

      document.getElementById('anthropic-key').value = '';
      document.getElementById('anthropic-key').placeholder = cfg.anthropic?.apiKey || 'sk-ant-api03-…';
      document.getElementById('anthropic-status').textContent = cfg.anthropic?.apiKey ? '✓ Set' : 'Not set';
      document.getElementById('anthropic-status').className = `key-status ${cfg.anthropic?.apiKey ? 'set' : 'notset'}`;

      document.getElementById('github-username').value = cfg.github?.username || '';
      document.getElementById('github-token').value = '';
      document.getElementById('github-token').placeholder = cfg.github?.token || 'ghp_…';
      document.getElementById('github-status').textContent = cfg.github?.token ? '✓ Token set' : 'No token';
      document.getElementById('github-status').className = `key-status ${cfg.github?.token ? 'set' : 'notset'}`;

      document.getElementById('leetcode-username').value = cfg.leetcode?.username || '';

      document.getElementById('linkedin-client-id').value = cfg.linkedin?.clientId || '';
      document.getElementById('linkedin-redirect-uri').value = cfg.linkedin?.redirectUri || `${CAREER_CONFIG.API_BASE}/api/auth/linkedin/callback`;
      document.getElementById('linkedin-status').textContent = cfg.linkedin?.accessToken ? '✓ Connected' : 'Not connected';
      document.getElementById('linkedin-status').className = `key-status ${cfg.linkedin?.accessToken ? 'set' : 'notset'}`;
      document.getElementById('linkedin-token-status').textContent = cfg.linkedin?.accessToken
        ? `Connected — token expires: ${cfg.linkedin?.expiresAt ? new Date(cfg.linkedin.expiresAt).toLocaleDateString() : 'unknown'}`
        : 'Not connected — click "Connect LinkedIn Account" after saving credentials';
    } catch (err) {
      toast('Failed to load API keys', 'error');
    }
  },

  async saveApiKey(service) {
    const payloads = {
      anthropic: () => ({
        integrations: { anthropic: { apiKey: document.getElementById('anthropic-key').value.trim() } }
      }),
      github: () => ({
        integrations: {
          github: {
            username: document.getElementById('github-username').value.trim(),
            token: document.getElementById('github-token').value.trim() || undefined
          }
        }
      }),
      leetcode: () => ({
        integrations: { leetcode: { username: document.getElementById('leetcode-username').value.trim() } }
      }),
      linkedin: () => ({
        integrations: {
          linkedin: {
            clientId: document.getElementById('linkedin-client-id').value.trim(),
            clientSecret: document.getElementById('linkedin-client-secret').value.trim(),
            redirectUri: document.getElementById('linkedin-redirect-uri').value.trim()
          }
        }
      })
    };

    const payload = payloads[service]?.();
    if (!payload) return;

    // Remove empty string values
    const cleanDeep = obj => {
      for (const k in obj) {
        if (obj[k] === '' || obj[k] === undefined) delete obj[k];
        else if (typeof obj[k] === 'object') cleanDeep(obj[k]);
      }
      return obj;
    };

    try {
      await api('/api/config', { method: 'PUT', body: JSON.stringify(cleanDeep(payload)) });
      toast(`${service.charAt(0).toUpperCase() + service.slice(1)} credentials saved`, 'success');
      this.loadApiKeys();
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  async startLinkedInOAuth() {
    try {
      const data = await api('/api/auth/linkedin');
      if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=700');
        toast('LinkedIn auth window opened — complete the flow then refresh this page', 'info', 8000);
      }
    } catch (err) {
      toast(err.message || 'LinkedIn OAuth failed — save credentials first', 'error');
    }
  },

  async changePassword() {
    const pw1 = document.getElementById('new-password').value;
    const pw2 = document.getElementById('confirm-password').value;
    if (!pw1 || pw1.length < 8) { toast('Password must be at least 8 characters', 'error'); return; }
    if (pw1 !== pw2) { toast('Passwords do not match', 'error'); return; }
    try {
      await api('/api/auth/password', { method: 'PUT', body: JSON.stringify({ newPassword: pw1 }) });
      toast('Password changed — please log in again', 'success');
      setTimeout(() => adminLogout(), 2000);
    } catch (err) {
      toast(err.message, 'error');
    }
  },

  // ── Cron Status ──
  async loadCronStatus() {
    try {
      const [github, leet, market] = await Promise.allSettled([
        api('/api/stats/github'),
        api('/api/stats/leetcode'),
        api('/api/market')
      ]);

      if (github.status === 'fulfilled' && github.value.lastUpdated) {
        document.getElementById('cron-last-github').textContent =
          'Last: ' + new Date(github.value.lastUpdated).toLocaleString();
      }
      if (leet.status === 'fulfilled' && leet.value.lastUpdated) {
        document.getElementById('cron-last-leetcode').textContent =
          'Last: ' + new Date(leet.value.lastUpdated).toLocaleString();
      }
      if (market.status === 'fulfilled' && market.value.lastUpdated) {
        document.getElementById('cron-last-market').textContent =
          'Last: ' + new Date(market.value.lastUpdated).toLocaleString();
      }
    } catch (err) {
      // Silently fail — cron status is non-critical
    }
  }
};

// ── Init ──────────────────────────────────────────────────────────────────────
(async function init() {
  // Auto-login if valid token exists
  const token = getToken();
  if (token) {
    try {
      await api('/api/auth/me');
      bootAdmin();
      return;
    } catch (_) {
      clearToken();
    }
  }
  // Show login
  document.getElementById('login-screen').classList.remove('hidden');
})();

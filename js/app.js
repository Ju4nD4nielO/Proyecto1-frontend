const grid = document.getElementById('games-grid');
const statsBar = document.getElementById('stats-bar');
const modalOverlay = document.getElementById('modal-overlay');
const confirmOverlay = document.getElementById('confirm-overlay');
const gamesForm = document.getElementById('games-form');
const modalTitle = document.getElementById('modal-title');
const toast = document.getElementById('toast');

let allGames = [];
let toastTimer;

// ── TOAST ──────────────────────────────────────────────
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── STATS ──────────────────────────────────────────────
function renderStats(games) {
  const total = games.length;
  const playing = games.filter(g => g.status === 'playing').length;
  const completed = games.filter(g => g.status === 'completed').length;
  const planned = games.filter(g => g.status === 'plan_to_play').length;

  statsBar.innerHTML = `
    <div class="stat-pill">Total: <span>${total}</span></div>
    <div class="stat-pill">🎮 Playing: <span>${playing}</span></div>
    <div class="stat-pill">✅ Completed: <span>${completed}</span></div>
    <div class="stat-pill">📋 Plan to play: <span>${planned}</span></div>
  `;
}

// ── STATUS LABEL ────────────────────────────────────────
function statusLabel(status) {
  const map = {
    playing: 'Playing',
    completed: 'Completed',
    plan_to_play: 'Plan to Play',
    dropped: 'Dropped',
    on_hold: 'On Hold',
  };
  return map[status] || status;
}

// ── RENDER CARDS ─────────────────────────────────────────
function renderGrid(games) {
  if (games.length === 0) {
    grid.innerHTML = `
      <div class="card-body">
        <div class="card-title">${escHtml(g.title)}</div>
        ${g.genre ? `<div class="card-genre">${escHtml(g.genre)}</div>` : ''}
        ${g.platform ? `<div class="card-genre">📱 ${escHtml(g.platform)}</div>` : ''}
        <span class="card-status status-${g.status}">${statusLabel(g.status)}</span>
        ${g.hours_played ? `<div class="card-episodes">⏱ ${g.hours_played}h played</div>` : ''}
        </div>   
    `;
    return;
  }

  grid.innerHTML = games.map(g => {
    const coverHtml = g.image_url
      ? `<img class="card-cover" src="${escHtml(g.image_url)}" alt="${escHtml(g.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="card-cover-placeholder" style="display:none">🎬</div>`
      : `<div class="card-cover-placeholder">🎬</div>`;

    const epText = (s.total_episodes && s.total_episodes > 0)
      ? `${s.episodes_watched || 0} / ${s.total_episodes} eps`
      : (s.episodes_watched ? `${s.episodes_watched} eps watched` : '');

    const epPercent = (s.total_episodes > 0)
      ? Math.min(100, Math.round((s.episodes_watched / s.total_episodes) * 100))
      : 0;

    const epBarHtml = (s.total_episodes > 0) ? `
      <div class="ep-bar">
        <div class="ep-bar-fill" style="width: ${epPercent}%"></div>
      </div>
    ` : '';

    return `
      <div class="games-card" data-id="${s.id}">
        ${coverHtml}
        <div class="card-body">
          <div class="card-title">${escHtml(s.title)}</div>
          ${s.genre ? `<div class="card-genre">${escHtml(s.genre)}</div>` : ''}
          <span class="card-status status-${s.status}">${statusLabel(s.status)}</span>
          ${epText ? `<div class="card-episodes">${epText}</div>${epBarHtml}` : ''}
        </div>
        <div class="card-actions">
          <button class="card-btn edit" onclick="openEdit(${s.id})">Edit</button>
          <button class="card-btn delete" onclick="confirmDelete(${s.id}, '${escHtml(s.title).replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── LOAD ─────────────────────────────────────────────────
async function loadGames() {
  try {
    allGames = await api.getAll();
    renderStats(allGames);
    renderGrid(allGames);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><span>⚠️</span><p>Could not connect to the API. Is the server running?</p></div>`;
  }
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal() { modalOverlay.classList.add('active'); }
function closeModal() {
  modalOverlay.classList.remove('active');
  gamesForm.reset();
  document.getElementById('games-id').value = '';
}

function fillForm(g) {
  document.getElementById('games-id').value = g.id;
  document.getElementById('title').value = g.title || '';
  document.getElementById('genre').value = g.genre || '';
  document.getElementById('platform').value = g.platform || '';
  document.getElementById('status').value = g.status || 'plan_to_play';
  document.getElementById('hours_played').value = g.hours_played ?? '';
  document.getElementById('image_url').value = g.image_url || '';
  document.getElementById('notes').value = g.notes || '';
}

function getFormData() {
  return {
    title: document.getElementById('title').value.trim(),
    genre: document.getElementById('genre').value.trim(),
    platform: document.getElementById('platform').value.trim(),
    status: document.getElementById('status').value,
    hours_played: parseInt(document.getElementById('hours_played').value) || 0,
    image_url: document.getElementById('image_url').value.trim(),
    notes: document.getElementById('notes').value.trim(),
  };
}

// ── OPEN ADD ──────────────────────────────────────────────
document.getElementById('btn-add').addEventListener('click', () => {
  modalTitle.textContent = 'Add Games';
  document.getElementById('btn-submit').textContent = 'Save Games';
  openModal();
});

// ── OPEN EDIT ─────────────────────────────────────────────
async function openEdit(id) {
  try {
    const games = await api.getOne(id);
    modalTitle.textContent = 'Edit Games';
    document.getElementById('btn-submit').textContent = 'Update Games';
    fillForm(games);
    openModal();
  } catch (err) {
    showToast('Could not load games data');
  }
}

// ── CLOSE MODAL ───────────────────────────────────────────
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

// ── SUBMIT FORM ───────────────────────────────────────────
gamesForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('games-id').value;
  const data = getFormData();
  const btn = document.getElementById('btn-submit');

  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    if (id) {
      await api.update(id, data);
      showToast('✨ Games updated!');
    } else {
      await api.create(data);
      showToast('🌸 Games added!');
    }
    closeModal();
    await loadGames();
  } catch (err) {
    showToast('Error: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Update Games' : 'Save Games';
  }
});

// ── DELETE CONFIRM ────────────────────────────────────────
let pendingDeleteId = null;

function confirmDelete(id, title) {
  pendingDeleteId = id;
  document.getElementById('confirm-title').textContent = `Delete "${title}"?`;
  confirmOverlay.classList.add('active');
}

document.getElementById('confirm-cancel').addEventListener('click', () => {
  confirmOverlay.classList.remove('active');
  pendingDeleteId = null;
});

document.getElementById('confirm-ok').addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  try {
    await api.remove(pendingDeleteId);
    confirmOverlay.classList.remove('active');
    pendingDeleteId = null;
    showToast('🗑️ Games deleted');
    await loadGames();
  } catch (err) {
    showToast('Could not delete games');
  }
});

confirmOverlay.addEventListener('click', e => {
  if (e.target === confirmOverlay) {
    confirmOverlay.classList.remove('active');
    pendingDeleteId = null;
  }
});

// ── INIT ──────────────────────────────────────────────────
loadGames();
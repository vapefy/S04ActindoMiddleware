const alertBox = document.querySelector('[data-role="alert"]');
const usersTbody = document.querySelector('[data-role="users-table"]');
const registrationsTbody = document.querySelector('[data-role="registrations-table"]');
const refreshBtn = document.querySelector('[data-action="refresh-users"]');
const refreshRegistrationsBtn = document.querySelector('[data-action="refresh-registrations"]');
const logoutBtn = document.querySelector('[data-action="logout"]');
const oauthPill = document.getElementById('oauth-pill');
const oauthMessage = document.getElementById('oauth-message');
const actindoPill = document.getElementById('actindo-pill');
const actindoMessage = document.getElementById('actindo-message');
const adminNavLinks = document.querySelectorAll('[data-nav-admin]');
const userNameEl = document.querySelector('[data-user-name]');

const SUMMARY_ENDPOINT = '/dashboard/summary';
const REFRESH_INTERVAL_MS = 15000;

function showError(message) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.add('alert--visible');
}

function hideError() {
    if (!alertBox) return;
    alertBox.classList.remove('alert--visible');
}

async function requireAdmin() {
    const response = await fetch('/auth/me', { cache: 'no-store' });
    const me = await response.json();
    if (!me?.authenticated) {
        window.location.href = `/login.html?returnUrl=${encodeURIComponent('/users.html')}`;
        return false;
    }
    if (me.role !== 'admin') {
        window.location.href = '/';
        return false;
    }

    adminNavLinks.forEach((el) => {
        if (el instanceof HTMLElement) el.hidden = false;
    });
    if (userNameEl instanceof HTMLElement) {
        userNameEl.hidden = false;
        userNameEl.textContent = me.username ?? '';
    }
    return true;
}

function escapeHtml(text) {
    return String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('de-DE', {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function updateOAuth(oauth) {
    if (!oauthPill || !oauthMessage) return;

    oauthPill.classList.remove('status-pill--ok', 'status-pill--warning', 'status-pill--error');

    const state = oauth?.state ?? 'unknown';
    if (state === 'ok') {
        oauthPill.classList.add('status-pill--ok');
    } else if (state === 'warning') {
        oauthPill.classList.add('status-pill--warning');
    } else if (state === 'error') {
        oauthPill.classList.add('status-pill--error');
    }

    oauthMessage.textContent = oauth?.message ?? (state === 'ok' ? 'Token gueltig' : 'Status unbekannt');
}

function updateActindo(actindo) {
    if (!actindoPill || !actindoMessage) return;

    actindoPill.classList.remove('status-pill--ok', 'status-pill--warning', 'status-pill--error');

    const state = actindo?.state ?? 'unknown';
    if (state === 'ok') {
        actindoPill.classList.add('status-pill--ok');
    } else if (state === 'warning') {
        actindoPill.classList.add('status-pill--warning');
    } else if (state === 'error') {
        actindoPill.classList.add('status-pill--error');
    }

    actindoMessage.textContent = actindo?.message ?? (state === 'ok' ? 'Actindo erreichbar' : 'Actindo Status unbekannt');
}

async function loadSummary() {
    try {
        const response = await fetch(SUMMARY_ENDPOINT, { cache: 'no-store' });
        if (response.status === 401 || response.status === 403) return;
        if (!response.ok) return;

        const payload = await response.json();
        updateOAuth(payload?.oauth ?? payload?.OAuth ?? null);
        updateActindo(payload?.actindo ?? payload?.Actindo ?? null);
    } catch {
        // ignore
    }
}

async function loadUsers() {
    if (!usersTbody) return;
    hideError();

    try {
        const response = await fetch('/users', { cache: 'no-store' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Load users failed (${response.status})`);
        }
        const users = await response.json();
        renderUsers(Array.isArray(users) ? users : []);
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Load users failed');
    }
}

async function loadRegistrations() {
    if (!registrationsTbody) return;
    hideError();

    try {
        const response = await fetch('/registrations', { cache: 'no-store' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Load registrations failed (${response.status})`);
        }
        const registrations = await response.json();
        renderRegistrations(Array.isArray(registrations) ? registrations : []);
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Load registrations failed');
    }
}

function renderUsers(users) {
    if (!usersTbody) return;
    usersTbody.innerHTML = '';
    if (!users.length) {
        usersTbody.innerHTML = '<tr><td colspan="4">No users.</td></tr>';
        return;
    }

    users.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(user.username)}</td>
            <td>
                <select class="users-role" data-action="set-role" data-user-id="${user.id}">
                    <option value="read" ${user.role === 'read' ? 'selected' : ''}>read</option>
                    <option value="write" ${user.role === 'write' ? 'selected' : ''}>write</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                </select>
            </td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="button button--danger button--small" data-action="delete-user" data-user-id="${user.id}">Delete</button>
            </td>
        `;

        tr.addEventListener('change', async (event) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            const select = target?.closest('select[data-action="set-role"]');
            if (!select) return;
            const userId = select.getAttribute('data-user-id');
            const role = select.value;
            try {
                const resp = await fetch(`/users/${encodeURIComponent(userId)}/role`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role })
                });
                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(text || `Set role failed (${resp.status})`);
                }
            } catch (error) {
                showError(error instanceof Error ? error.message : 'Set role failed');
                await loadUsers();
            }
        });

        tr.addEventListener('click', async (event) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            const button = target?.closest('button[data-action="delete-user"]');
            if (!button) return;

            const userId = button.getAttribute('data-user-id');
            const confirmed = window.confirm('Delete this user?');
            if (!confirmed) return;

            try {
                const resp = await fetch(`/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(text || `Delete failed (${resp.status})`);
                }
                await loadUsers();
            } catch (error) {
                showError(error instanceof Error ? error.message : 'Delete failed');
            }
        });

        usersTbody.appendChild(tr);
    });
}

function renderRegistrations(registrations) {
    if (!registrationsTbody) return;
    registrationsTbody.innerHTML = '';
    if (!registrations.length) {
        registrationsTbody.innerHTML = '<tr><td colspan="4">Keine offenen Registrierungen.</td></tr>';
        return;
    }

    registrations.forEach((registration) => {
        const tr = document.createElement('tr');
        const roleSelectId = `role-${registration.id}`;
        tr.innerHTML = `
            <td>${escapeHtml(registration.username)}</td>
            <td>${formatDate(registration.createdAt)}</td>
            <td>
                <select class="users-role" data-action="set-registration-role" data-registration-id="${registration.id}" id="${roleSelectId}">
                    <option value="read">read</option>
                    <option value="write">write</option>
                    <option value="admin">admin</option>
                </select>
            </td>
            <td>
                <div class="users-row-actions">
                    <button class="button button--small" data-action="approve-registration" data-registration-id="${registration.id}">Freigeben</button>
                    <button class="button button--danger button--small" data-action="deny-registration" data-registration-id="${registration.id}">Ablehnen</button>
                </div>
            </td>
        `;

        tr.addEventListener('click', async (event) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            if (!target) return;

            const approve = target.closest('button[data-action="approve-registration"]');
            const deny = target.closest('button[data-action="deny-registration"]');
            if (approve) {
                const registrationId = approve.getAttribute('data-registration-id');
                const select = tr.querySelector('select[data-action="set-registration-role"]');
                const role = select ? select.value : 'read';
                try {
                    const resp = await fetch(`/registrations/${encodeURIComponent(registrationId)}/approve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role })
                    });
                    if (!resp.ok) {
                        const text = await resp.text();
                        throw new Error(text || `Approve failed (${resp.status})`);
                    }
                    await Promise.all([loadRegistrations(), loadUsers()]);
                } catch (error) {
                    showError(error instanceof Error ? error.message : 'Approve failed');
                }
            } else if (deny) {
                const registrationId = deny.getAttribute('data-registration-id');
                const confirmed = window.confirm('Registrierung ablehnen?');
                if (!confirmed) return;
                try {
                    const resp = await fetch(`/registrations/${encodeURIComponent(registrationId)}`, { method: 'DELETE' });
                    if (!resp.ok) {
                        const text = await resp.text();
                        throw new Error(text || `Delete failed (${resp.status})`);
                    }
                    await loadRegistrations();
                } catch (error) {
                    showError(error instanceof Error ? error.message : 'Delete failed');
                }
            }
        });

        registrationsTbody.appendChild(tr);
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadUsers());
}

if (refreshRegistrationsBtn) {
    refreshRegistrationsBtn.addEventListener('click', () => loadRegistrations());
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}

const ok = await requireAdmin();
if (ok) {
    loadSummary();
    setInterval(loadSummary, REFRESH_INTERVAL_MS);
    await Promise.all([loadUsers(), loadRegistrations()]);
}

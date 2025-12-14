const alertBox = document.querySelector('[data-role="alert"]');
const tableBody = document.querySelector('[data-role="customers-table"]');
const refreshBtn = document.querySelector('[data-action="refresh"]');
const logoutBtn = document.querySelector('[data-action="logout"]');
const filterInput = document.querySelector('[data-role="filter-input"]');
const adminNavLinks = document.querySelectorAll('[data-nav-admin]');
const userNameEl = document.querySelector('[data-user-name]');
const oauthPill = document.getElementById('oauth-pill');
const oauthMessage = document.getElementById('oauth-message');
const actindoPill = document.getElementById('actindo-pill');
const actindoMessage = document.getElementById('actindo-message');

const SUMMARY_ENDPOINT = '/dashboard/summary';
const CUSTOMERS_ENDPOINT = '/customers';
const REFRESH_INTERVAL_MS = 15000;
let customersCache = [];

function showAlert(message, variant = 'error') {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.add('alert--visible');
    alertBox.classList.toggle('alert--success', variant === 'success');
}

function hideAlert() {
    if (!alertBox) return;
    alertBox.classList.remove('alert--visible');
    alertBox.classList.remove('alert--success');
}

async function requireRead() {
    const response = await fetch('/auth/me', { cache: 'no-store' });
    const me = await response.json();
    if (!me?.authenticated) {
        window.location.href = `/login.html?returnUrl=${encodeURIComponent('/customers.html')}`;
        return false;
    }

    adminNavLinks.forEach((el) => {
        if (el instanceof HTMLElement) el.hidden = me.role !== 'admin';
    });
    if (logoutBtn instanceof HTMLElement) logoutBtn.hidden = false;
    if (userNameEl instanceof HTMLElement) {
        userNameEl.hidden = false;
        userNameEl.textContent = me.username ?? '';
    }
    return true;
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
        if (!response.ok) return;
        const payload = await response.json();
        updateOAuth(payload?.oauth ?? payload?.OAuth ?? null);
        updateActindo(payload?.actindo ?? payload?.Actindo ?? null);
    } catch {
        // ignore
    }
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

async function loadCustomers() {
    if (!tableBody) return;
    hideAlert();
    try {
        const response = await fetch(CUSTOMERS_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Load failed (${response.status})`);
        }
        const items = await response.json();
        customersCache = Array.isArray(items) ? items : [];
        renderCustomers(customersCache);
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Customers konnten nicht geladen werden.');
    }
}

function renderCustomers(items) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!items.length) {
        tableBody.innerHTML = '<tr><td colspan="4">Keine Kunden gefunden.</td></tr>';
        return;
    }

    items.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.customerId ?? '-'}</td>
            <td>${escapeHtml(item.debtorNumber)}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${formatDate(item.createdAt)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function applyFilter() {
    const term = filterInput?.value.trim().toLowerCase();
    if (!term) return renderCustomers(customersCache);

    const filtered = customersCache.filter((item) => {
        const name = (item.name || '').toString().toLowerCase();
        const debtor = (item.debtorNumber || '').toString().toLowerCase();
        const id = item.customerId != null ? String(item.customerId) : '';
        return name.includes(term) || debtor.includes(term) || id.includes(term);
    });
    renderCustomers(filtered);
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadCustomers());
}

if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}

(async () => {
    const ok = await requireRead();
    if (!ok) return;
    await loadCustomers();
    loadSummary();
    setInterval(loadSummary, REFRESH_INTERVAL_MS);
})();


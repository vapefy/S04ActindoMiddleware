const alertBox = document.querySelector('[data-role="alert"]');
const tableBody = document.querySelector('[data-role="products-table"]');
const refreshBtn = document.querySelector('[data-action="refresh"]');
const syncBtn = document.querySelector('[data-action="sync"]');
const clearBtn = document.querySelector('[data-action="clear-products"]');
const logoutBtn = document.querySelector('[data-action="logout"]');
const filterInput = document.querySelector('[data-role="filter-input"]');
const adminNavLinks = document.querySelectorAll('[data-nav-admin]');
const userNameEl = document.querySelector('[data-user-name]');
const oauthPill = document.getElementById('oauth-pill');
const oauthMessage = document.getElementById('oauth-message');
const actindoPill = document.getElementById('actindo-pill');
const actindoMessage = document.getElementById('actindo-message');

const SUMMARY_ENDPOINT = '/dashboard/summary';
const PRODUCTS_ENDPOINT = '/products';
const PRODUCTS_SYNC_ENDPOINT = '/products/sync';
const PRODUCTS_CLEAR_ENDPOINT = '/dashboard/jobs?type=product';
const REFRESH_INTERVAL_MS = 15000;
let productsCache = [];

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
        window.location.href = `/login.html?returnUrl=${encodeURIComponent('/products.html')}`;
        return false;
    }

    adminNavLinks.forEach((el) => {
        if (el instanceof HTMLElement) el.hidden = !['admin'].includes(me.role);
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

async function loadProducts() {
    if (!tableBody) return;
    hideAlert();
    try {
        const response = await fetch(PRODUCTS_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Load failed (${response.status})`);
        }
        const items = await response.json();
        productsCache = Array.isArray(items) ? items : [];
        renderProducts(productsCache);
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Produkte konnten nicht geladen werden.');
    }
}

function renderProducts(items) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!items.length) {
        tableBody.innerHTML = '<tr><td colspan="5">Keine Produkte gefunden.</td></tr>';
        return;
    }

    items.forEach((item) => {
        const tr = document.createElement('tr');
        const variantText = item.variantCount && item.variantCount > 0
            ? `Produkt mit ${item.variantCount} Varianten`
            : '';
        tr.innerHTML = `
            <td>${item.productId ?? '-'}</td>
            <td>${escapeHtml(item.sku)}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${variantText}</td>
            <td>${formatDate(item.createdAt)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function applyFilter() {
    if (!filterInput) return renderProducts(productsCache);
    const term = filterInput.value.trim().toLowerCase();
    if (!term) return renderProducts(productsCache);

    const filtered = productsCache.filter((item) => {
        const sku = (item.sku || '').toString().toLowerCase();
        const name = (item.name || '').toString().toLowerCase();
        const id = item.productId != null ? String(item.productId) : '';
        return sku.includes(term) || name.includes(term) || id.includes(term);
    });
    renderProducts(filtered);
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadProducts());
}

if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
        if (!syncBtn) return;
        syncBtn.disabled = true;
        hideAlert();
        try {
            const response = await fetch(PRODUCTS_SYNC_ENDPOINT, { cache: 'no-store' });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `Sync failed (${response.status})`);
            }
            const items = await response.json();
            productsCache = Array.isArray(items) ? items : [];
            renderProducts(productsCache);
            showAlert('Synchronisation abgeschlossen.', 'success');
        } catch (error) {
            showAlert(error instanceof Error ? error.message : 'Sync failed');
        } finally {
            syncBtn.disabled = false;
        }
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
        const confirmed = window.confirm('Alle uebertragenen Produkte aus der Liste loeschen?');
        if (!confirmed) return;
        hideAlert();
        try {
            const response = await fetch(PRODUCTS_CLEAR_ENDPOINT, { method: 'DELETE' });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `Clear failed (${response.status})`);
            }
            productsCache = [];
            renderProducts(productsCache);
            showAlert('Produktliste geloescht.', 'success');
        } catch (error) {
            showAlert(error instanceof Error ? error.message : 'Loeschen fehlgeschlagen');
        }
    });
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
    await loadProducts();
    loadSummary();
    setInterval(loadSummary, REFRESH_INTERVAL_MS);
})();

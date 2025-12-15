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
const PRODUCTS_DELETE_ENDPOINT = '/products/delete';
const REFRESH_INTERVAL_MS = 15000;
const PAGE_SIZE = 20;
let productsCache = [];
let filteredProducts = [];
let currentPage = 1;
let currentUserRole = 'read';
const pageInfo = document.querySelector('[data-role="page-info"]');
const prevPageBtn = document.querySelector('[data-action="prev-page"]');
const nextPageBtn = document.querySelector('[data-action="next-page"]');

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
    currentUserRole = me.role ?? 'read';
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
        filteredProducts = productsCache.slice();
        currentPage = 1;
        renderProducts();
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Produkte konnten nicht geladen werden.');
    }
}

function renderProducts() {
    if (!tableBody) return;
    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filteredProducts.slice(start, start + PAGE_SIZE);

    tableBody.innerHTML = '';
    if (!pageItems.length) {
        tableBody.innerHTML = '<tr><td colspan="6">Keine Produkte gefunden.</td></tr>';
    } else {
        const canDelete = currentUserRole === 'admin' || currentUserRole === 'write';

        pageItems.forEach((item) => {
            const tr = document.createElement('tr');
            const variantText = item.variantCount && item.variantCount > 0
                ? `Produkt mit ${item.variantCount} Varianten`
                : '';
            const productId = item.productId ?? '';
            const jobId = item.jobId ?? '';
            const deleteDisabled = !canDelete || !productId || !jobId;
            tr.innerHTML = `
                <td>${productId || '-'}</td>
                <td>${escapeHtml(item.sku)}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${variantText}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td class="table-actions">
                    ${canDelete ? `<button class="button button--danger button--small" data-action="delete-product" data-product-id="${productId}" data-job-id="${jobId}" ${deleteDisabled ? 'disabled' : ''}>Produkt loeschen</button>` : '-'}
                </td>
            `;
            tableBody.appendChild(tr);
            if (canDelete) {
                const btn = tr.querySelector('[data-action="delete-product"]');
                if (btn) {
                    btn.dataset.sku = item.sku ?? '';
                }
            }
        });
    }
    updatePagination(currentPage, totalPages);
}

function applyFilter() {
    if (!filterInput) {
        filteredProducts = productsCache.slice();
        currentPage = 1;
        return renderProducts();
    }
    const term = filterInput.value.trim().toLowerCase();
    if (!term) {
        filteredProducts = productsCache.slice();
        currentPage = 1;
        return renderProducts();
    }

    filteredProducts = productsCache.filter((item) => {
        const sku = (item.sku || '').toString().toLowerCase();
        const name = (item.name || '').toString().toLowerCase();
        const id = item.productId != null ? String(item.productId) : '';
        return sku.includes(term) || name.includes(term) || id.includes(term);
    });
    currentPage = 1;
    renderProducts();
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
            filteredProducts = productsCache.slice();
            currentPage = 1;
            renderProducts();
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
            filteredProducts = [];
            currentPage = 1;
            renderProducts();
            showAlert('Produktliste geloescht.', 'success');
        } catch (error) {
            showAlert(error instanceof Error ? error.message : 'Loeschen fehlgeschlagen');
        }
    });
}

if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
}

if (tableBody) {
    tableBody.addEventListener('click', async (event) => {
        const target = event.target;
        const button = target instanceof HTMLElement ? target.closest('[data-action="delete-product"]') : null;
        if (!button) return;

        const productId = Number(button.getAttribute('data-product-id'));
        const jobId = button.getAttribute('data-job-id');
        const sku = button.getAttribute('data-sku') || '';
        if (!productId || !jobId) return;

        const confirmed = window.confirm('Produkt wirklich loeschen?');
        if (!confirmed) return;

        await deleteProduct(productId, jobId, sku, button);
    });
}

async function deleteProduct(productId, jobId, sku, button) {
    hideAlert();
    button.disabled = true;
    try {
        const response = await fetch(PRODUCTS_DELETE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, jobId, sku })
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Delete failed (${response.status})`);
        }
        productsCache = productsCache.filter((p) => String(p.jobId) !== String(jobId));
        applyFilter();
        showAlert('Produkt geloescht.', 'success');
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Produkt konnte nicht geloescht werden.');
        button.disabled = false;
    }
}

function updatePagination(page, totalPages) {
    if (pageInfo) {
        const safeTotal = totalPages || 1;
        const safePage = totalPages === 0 ? 0 : page;
        pageInfo.textContent = `Seite ${safePage} / ${safeTotal}`;
    }
    if (prevPageBtn) prevPageBtn.disabled = page <= 1;
    if (nextPageBtn) nextPageBtn.disabled = totalPages === 0 || page >= totalPages;
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (currentPage <= 1) return;
        currentPage -= 1;
        renderProducts();
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
        if (currentPage >= totalPages) return;
        currentPage += 1;
        renderProducts();
    });
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

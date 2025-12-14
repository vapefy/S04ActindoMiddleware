const alertBox = document.querySelector('[data-role="alert"]');
const settingsForm = document.querySelector('[data-role="settings-form"]');
const endpointInputs = document.querySelectorAll('[data-endpoint-key]');
const logoutBtn = document.querySelector('[data-action="logout"]');
const refreshBtn = document.querySelector('[data-action="refresh"]');
const resetBtn = document.querySelector('[data-action="reset-defaults"]');
const saveBtn = document.querySelector('[data-action="save-settings"]');
const adminNavLinks = document.querySelectorAll('[data-nav-admin]');
const userNameEl = document.querySelector('[data-user-name]');
const oauthPill = document.getElementById('oauth-pill');
const oauthMessage = document.getElementById('oauth-message');
const actindoPill = document.getElementById('actindo-pill');
const actindoMessage = document.getElementById('actindo-message');

const SUMMARY_ENDPOINT = '/dashboard/summary';
const SETTINGS_ENDPOINT = '/settings/actindo';
const REFRESH_INTERVAL_MS = 15000;

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

async function requireAdmin() {
    const response = await fetch('/auth/me', { cache: 'no-store' });
    const me = await response.json();
    if (!me?.authenticated) {
        window.location.href = `/login.html?returnUrl=${encodeURIComponent('/settings.html')}`;
        return false;
    }
    if (me.role !== 'admin') {
        window.location.href = '/';
        return false;
    }

    adminNavLinks.forEach((el) => {
        if (el instanceof HTMLElement) el.hidden = false;
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

function toDateTimeLocalString(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

async function loadSettings() {
    hideAlert();
    try {
        const response = await fetch(SETTINGS_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Load failed (${response.status})`);
        }
        const settings = await response.json();
        fillForm(settings);
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Settings konnten nicht geladen werden.');
    }
}

function fillForm(settings) {
    if (!settingsForm) return;
    const accessTokenInput = settingsForm.querySelector('input[name="accessToken"]');
    const refreshTokenInput = settingsForm.querySelector('input[name="refreshToken"]');
    const tokenEndpointInput = settingsForm.querySelector('input[name="tokenEndpoint"]');
    const clientIdInput = settingsForm.querySelector('input[name="clientId"]');
    const clientSecretInput = settingsForm.querySelector('input[name="clientSecret"]');
    const expiresInput = settingsForm.querySelector('input[name="accessTokenExpiresAt"]');

    if (accessTokenInput) accessTokenInput.value = settings.accessToken ?? '';
    if (refreshTokenInput) refreshTokenInput.value = settings.refreshToken ?? '';
    if (tokenEndpointInput) tokenEndpointInput.value = settings.tokenEndpoint ?? '';
    if (clientIdInput) clientIdInput.value = settings.clientId ?? '';
    if (clientSecretInput) clientSecretInput.value = settings.clientSecret ?? '';
    if (expiresInput) expiresInput.value = toDateTimeLocalString(settings.accessTokenExpiresAt);

    const endpoints = settings.endpoints || {};
    endpointInputs.forEach((input) => {
        const key = input.getAttribute('data-endpoint-key');
        input.value = endpoints[key] ?? '';
    });
}

function collectSettings() {
    const settings = {
        accessToken: '',
        refreshToken: '',
        tokenEndpoint: '',
        clientId: '',
        clientSecret: '',
        accessTokenExpiresAt: null,
        endpoints: {}
    };

    if (settingsForm) {
        settings.accessToken = settingsForm.querySelector('input[name="accessToken"]')?.value.trim() ?? '';
        settings.refreshToken = settingsForm.querySelector('input[name="refreshToken"]')?.value.trim() ?? '';
        settings.tokenEndpoint = settingsForm.querySelector('input[name="tokenEndpoint"]')?.value.trim() ?? '';
        settings.clientId = settingsForm.querySelector('input[name="clientId"]')?.value.trim() ?? '';
        settings.clientSecret = settingsForm.querySelector('input[name="clientSecret"]')?.value.trim() ?? '';
        const expiresRaw = settingsForm.querySelector('input[name="accessTokenExpiresAt"]')?.value;
        settings.accessTokenExpiresAt = expiresRaw ? new Date(expiresRaw).toISOString() : null;
    }

    endpointInputs.forEach((input) => {
        const key = input.getAttribute('data-endpoint-key');
        if (!key) return;
        settings.endpoints[key] = input.value.trim();
    });

    return settings;
}

async function saveSettings() {
    hideAlert();
    const payload = collectSettings();

    try {
        const resp = await fetch(SETTINGS_ENDPOINT, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(text || `Save failed (${resp.status})`);
        }
        showAlert('Settings gespeichert.', 'success');
    } catch (error) {
        showAlert(error instanceof Error ? error.message : 'Save failed');
    }
}

function resetToDefaults() {
    const defaults = {
        CREATE_PRODUCT: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.create',
        SAVE_PRODUCT: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.save',
        CREATE_INVENTORY: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.Fulfillment.Inventories.create',
        CREATE_INVENTORY_MOVEMENT: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.Fulfillment.InventoryMovements.create',
        CREATE_RELATION: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.changeVariantMaster',
        CREATE_CUSTOMER: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.Customers.create',
        SAVE_CUSTOMER: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.Customers.save',
        SAVE_PRIMARY_ADDRESS: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.CustomersAndSuppliers.PrimaryAddresses.save',
        GET_TRANSACTIONS: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.RetailSuite.RetailSuiteFaktBase.BusinessDocuments.getList',
        CREATE_FILE: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.ECM.Explorer.create',
        PRODUCT_FILES_SAVE: 'https://schalke-dev.dev.actindo.com/Actindo.Modules.Actindo.PIM.Products.save'
    };

    endpointInputs.forEach((input) => {
        const key = input.getAttribute('data-endpoint-key');
        if (!key) return;
        input.value = defaults[key] ?? '';
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadSettings());
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetToDefaults);
}

if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        await saveSettings();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}

(async () => {
    const ok = await requireAdmin();
    if (!ok) return;
    await loadSettings();
    loadSummary();
    setInterval(loadSummary, REFRESH_INTERVAL_MS);
})();

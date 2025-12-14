const alertBox = document.querySelector('[data-role="alert"]');
const loginForm = document.querySelector('[data-role="login-form"]');
const bootstrapSection = document.querySelector('[data-role="bootstrap"]');
const bootstrapForm = document.querySelector('[data-role="bootstrap-form"]');

function showError(message) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.classList.add('alert--visible');
}

function hideError() {
    if (!alertBox) return;
    alertBox.classList.remove('alert--visible');
}

function getReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl');
    if (!returnUrl) return '/';
    if (!returnUrl.startsWith('/')) return '/';
    return returnUrl;
}

async function checkBootstrapNeeded() {
    try {
        const response = await fetch('/auth/bootstrap-needed', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        const needed = Boolean(payload?.needed);
        if (bootstrapSection) {
            bootstrapSection.hidden = !needed;
        }
    } catch {
        // ignore
    }
}

async function submitLogin(username, password) {
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const text = await response.text();
        let friendly = 'Username oder Passwort ist ungueltig.';
        try {
            const parsed = JSON.parse(text);
            if (parsed?.error) friendly = String(parsed.error);
        } catch {
            // ignore parse error
        }
        throw new Error(friendly);
    }
}

async function submitBootstrap(username, password) {
    const response = await fetch('/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'admin' })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Bootstrap failed (${response.status})`);
    }
}

async function redirectIfAlreadyLoggedIn() {
    try {
        const response = await fetch('/auth/me', { cache: 'no-store' });
        if (!response.ok) return;
        const me = await response.json();
        if (me?.authenticated) {
            window.location.href = getReturnUrl();
        }
    } catch {
        // ignore
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError();

        const formData = new FormData(loginForm);
        const username = String(formData.get('username') ?? '').trim();
        const password = String(formData.get('password') ?? '');
        if (!username || !password) {
            showError('Username und Password sind erforderlich.');
            return;
        }

        try {
            await submitLogin(username, password);
            window.location.href = getReturnUrl();
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Login failed');
        }
    });
}

if (bootstrapForm) {
    bootstrapForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideError();

        const formData = new FormData(bootstrapForm);
        const username = String(formData.get('username') ?? '').trim();
        const password = String(formData.get('password') ?? '');
        if (!username || !password) {
            showError('Username und Password sind erforderlich.');
            return;
        }

        try {
            await submitBootstrap(username, password);
            window.location.href = '/users.html';
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Bootstrap failed');
        }
    });
}

checkBootstrapNeeded();
redirectIfAlreadyLoggedIn();

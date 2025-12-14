const alertBox = document.querySelector('[data-role="alert"]');
const registerForm = document.querySelector('[data-role="register-form"]');

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

async function redirectIfAlreadyLoggedIn() {
    try {
        const response = await fetch('/auth/me', { cache: 'no-store' });
        if (!response.ok) return;
        const me = await response.json();
        if (me?.authenticated) {
            window.location.href = '/';
        }
    } catch {
        // ignore
    }
}

async function submitRegistration(username, password) {
    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Registrierung fehlgeschlagen (${response.status})`);
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideAlert();

        const formData = new FormData(registerForm);
        const username = String(formData.get('username') ?? '').trim();
        const password = String(formData.get('password') ?? '');
        const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

        if (!username || !password || !passwordConfirm) {
            showAlert('Bitte alle Felder ausfuellen.');
            return;
        }

        if (password !== passwordConfirm) {
            showAlert('Passwoerter stimmen nicht ueberein.');
            return;
        }

        try {
            await submitRegistration(username, password);
            registerForm.reset();
            showAlert('Registrierung wurde gesendet. Warte auf Freigabe.', 'success');
        } catch (error) {
            showAlert(error instanceof Error ? error.message : 'Registrierung fehlgeschlagen');
        }
    });
}

redirectIfAlreadyLoggedIn();

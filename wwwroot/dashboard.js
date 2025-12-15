const SUMMARY_ENDPOINT = '/dashboard/summary';
const JOBS_ENDPOINT = '/dashboard/jobs?limit=20';
const REFRESH_INTERVAL_MS = 15000;
const CARD_KEYS = ['products', 'customers', 'transactions', 'media'];

const activeJobsEl = document.querySelector('[data-field="active-jobs"]');
const timestampEls = document.querySelectorAll('[data-field="timestamp"]');
const oauthPill = document.getElementById('oauth-pill');
const oauthMessage = document.getElementById('oauth-message');
const actindoPill = document.getElementById('actindo-pill');
const actindoMessage = document.getElementById('actindo-message');
const alertBox = document.querySelector('[data-role="alert"]');
const logoutBtn = document.querySelector('[data-action="logout"]');
const adminNavLinks = document.querySelectorAll('[data-nav-admin]');
const userNameEl = document.querySelector('[data-user-name]');

const jobsTableBody = document.querySelector('[data-jobs-table]');
const jobDetailsSection = document.querySelector('[data-job-details]');
const jobTitleEl = document.querySelector('[data-job-title]');
const jobMetaEl = document.querySelector('[data-job-meta]');
const jobStatusEl = document.querySelector('[data-job-status]');
const jobRequestCode = document.querySelector('[data-job-request-json]');
const jobResponseCode = document.querySelector('[data-job-response-json]');
const jobResponseWrapper = jobResponseCode ? jobResponseCode.parentElement : null;
const jobFeedbackEl = document.querySelector('[data-job-feedback]');
const actindoLogsContainer = document.querySelector('[data-actindo-logs]');
const replayBtn = document.querySelector('[data-action="open-replay"]');
const refreshJobsBtn = document.querySelector('[data-action="refresh-jobs"]');
const clearHistoryBtn = document.querySelector('[data-action="clear-history"]');
const copyJobRequestBtn = document.querySelector('[data-action="copy-job-request"]');
const copyJobResponseBtn = document.querySelector('[data-action="copy-job-response"]');

const modal = document.querySelector('[data-modal]');
const replayEditor = document.getElementById('replay-editor');
const modalFeedback = document.querySelector('[data-modal-feedback]');
const modalCloseBtn = document.querySelector('[data-action="close-modal"]');
const modalSubmitBtn = document.querySelector('[data-action="submit-replay"]');
const pageHasJobs = Boolean(jobsTableBody);

let jobsCache = [];
let selectedJobId = null;
let modalJobId = null;
let currentUser = { authenticated: false, username: '', role: '' };
let permissions = { canWrite: false, isAdmin: false };

async function requireLogin() {
    const response = await fetch('/auth/me', { cache: 'no-store' });
    const me = await response.json();
    currentUser = me ?? { authenticated: false };

    if (!currentUser?.authenticated) {
        const returnUrl = window.location.pathname || '/';
        window.location.href = `/login.html?returnUrl=${encodeURIComponent(returnUrl)}`;
        return false;
    }

    const role = String(currentUser.role ?? '').toLowerCase();
    permissions = {
        canWrite: role === 'write' || role === 'admin',
        isAdmin: role === 'admin'
    };

    adminNavLinks.forEach((el) => {
        if (el instanceof HTMLElement) el.hidden = !permissions.isAdmin;
    });

    if (logoutBtn instanceof HTMLElement) {
        logoutBtn.hidden = false;
    }
    if (userNameEl instanceof HTMLElement) {
        userNameEl.hidden = false;
        userNameEl.textContent = currentUser.username ?? '';
    }

    return true;
}

async function loadSummary() {
    try {
        const response = await fetch(SUMMARY_ENDPOINT, { cache: 'no-store' });
        if (response.status === 401 || response.status === 403) {
            await requireLogin();
            return;
        }
        if (!response.ok) {
            throw new Error(`Summary request failed (${response.status})`);
        }
        const payload = await response.json();
        renderSummary(payload);
        hideError();
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Unbekannter Fehler');
        console.error('Dashboard summary failed', error);
    }
}

async function loadJobs() {
    if (!pageHasJobs) return;
    try {
        const response = await fetch(JOBS_ENDPOINT, { cache: 'no-store' });
        if (response.status === 401 || response.status === 403) {
            await requireLogin();
            return;
        }
        if (!response.ok) {
            throw new Error(`Jobs request failed (${response.status})`);
        }

        const payload = await response.json();
        jobsCache = payload.jobs ?? [];
        renderJobs();
        hideError();
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Jobs-Update fehlgeschlagen');
        console.error('Dashboard jobs failed', error);
    }
}

function renderSummary(data) {
    if (activeJobsEl) {
        const generatedAt = data.generatedAt ? new Date(data.generatedAt) : new Date();
        activeJobsEl.textContent = Number(data.activeJobs ?? 0).toString();
        const formatted = generatedAt.toLocaleString('de-DE', {
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timestampEls.forEach((el) => {
            el.textContent = formatted;
        });
    }

    CARD_KEYS.forEach((key) => updateCard(key, data[key]));
    const oauthData = data.oauth ?? data.oAuth ?? data.OAuth ?? null;
    updateOAuth(oauthData);
    const actindoData = data.actindo ?? data.Actindo ?? null;
    updateActindo(actindoData);
}

function renderJobs() {
    if (!jobsTableBody) return;

    jobsTableBody.innerHTML = '';
    if (!jobsCache.length) {
        jobsTableBody.innerHTML = '<tr><td colspan="6">Noch keine Jobs vorhanden.</td></tr>';
        if (jobDetailsSection) jobDetailsSection.hidden = true;
        return;
    }

    jobsCache.forEach((job) => {
        const row = document.createElement('tr');
        row.classList.add('jobs-table__row');
        if (job.id === selectedJobId) {
            row.classList.add('jobs-table__row--active');
        }

        row.innerHTML = `
            <td>${escapeHtml(job.endpoint)}</td>
            <td>${renderStatusBadge(job)}</td>
            <td>${formatDuration(job.durationMilliseconds)}</td>
            <td>${formatDate(job.startedAt)}</td>
            <td>${formatDate(job.completedAt)}</td>
            <td>
                <div class="jobs-table__actions">
                    <button class="button button--ghost" data-action="preview-job" data-job-id="${job.id}">Details</button>
                    ${permissions.canWrite
                        ? `<button class="button button--danger" data-action="delete-job" data-job-id="${job.id}">Loeschen</button>`
                        : ''}
                </div>
            </td>
        `;

        row.addEventListener('click', (event) => {
            const target = event.target instanceof HTMLElement ? event.target : null;
            const actionButton = target?.closest('button[data-action]');
            if (actionButton) {
                const action = actionButton.getAttribute('data-action');
                if (action === 'delete-job') {
                    event.stopPropagation();
                    deleteSingleJob(job.id);
                    return;
                }
                if (action === 'preview-job') {
                    event.stopPropagation();
                    selectJob(job.id);
                    return;
                }
            }

            selectJob(job.id);
        });
        jobsTableBody.appendChild(row);
    });

    if (!selectedJobId && jobsCache.length > 0) {
        selectJob(jobsCache[0].id);
    } else if (selectedJobId) {
        const job = jobsCache.find((item) => item.id === selectedJobId);
        if (job) {
            updateJobDetails(job);
        } else if (jobDetailsSection) {
            jobDetailsSection.hidden = true;
        }
    }
}

function renderStatusBadge(job) {
    const isSuccess = Boolean(job.success);
    const className = isSuccess ? 'badge badge--success' : 'badge badge--error';
    return `<span class="${className}">${isSuccess ? 'OK' : 'Fehler'}</span>`;
}

function updateCard(cardKey, stats) {
    const card = document.querySelector(`.metric-card[data-card="${cardKey}"]`);
    if (!card || !stats) return;

    const success = Number(stats.success ?? 0);
    const failed = Number(stats.failed ?? 0);
    const average = Number(stats.averageDurationSeconds ?? 0);

    const successEl = card.querySelector('[data-role="success"]');
    const failedEl = card.querySelector('[data-role="failed"]');
    const avgEl = card.querySelector('[data-role="avg"]');

    if (successEl) successEl.textContent = success.toString();
    if (failedEl) failedEl.textContent = failed.toString();
    if (avgEl) avgEl.textContent = `${average.toFixed(1)}s`;
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

    oauthMessage.textContent = (state === 'ok' ? 'Token gueltig' : 'Status unbekannt');

    if (oauth?.expiresAt) {
        const expiresDate = new Date(oauth.expiresAt);
        oauthPill.title = `Expires ${expiresDate.toLocaleString('de-DE', { hour12: false })}`;
    } else {
        oauthPill.title = '';
    }
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

    const tooltipParts = [];
    if (actindo?.lastSuccessAt) tooltipParts.push(`Last success ${formatDate(actindo.lastSuccessAt)}`);
    if (actindo?.lastFailureAt) tooltipParts.push(`Last failure ${formatDate(actindo.lastFailureAt)}`);
    actindoPill.title = tooltipParts.join(' | ');
}

function selectJob(jobId) {
    selectedJobId = jobId;
    renderJobs();
    const job = jobsCache.find((item) => item.id === jobId);
    if (job) {
        updateJobDetails(job);
    }
}

function updateJobDetails(job) {
    if (!jobDetailsSection) return;
    jobDetailsSection.hidden = false;
    if (jobTitleEl) jobTitleEl.textContent = job.endpoint;
    if (jobMetaEl) {
        jobMetaEl.textContent = `Gestartet ${formatDate(job.startedAt)} :: Dauer ${formatDuration(job.durationMilliseconds)}`;
    }

    if (jobStatusEl) {
        jobStatusEl.textContent = job.success ? 'Erfolgreich' : 'Fehler';
        jobStatusEl.className = job.success ? 'badge badge--success' : 'badge badge--error';
    }

    if (jobRequestCode) {
        jobRequestCode.textContent = prettifyJson(job.requestPayload);
    }

    if (jobResponseCode) {
        const payload = job.success
            ? job.responsePayload
            : job.errorPayload ?? job.responsePayload;
        jobResponseCode.textContent = prettifyJson(payload);
        if (jobResponseWrapper) {
            jobResponseWrapper.classList.toggle('code-block--error', !job.success);
        }
    }

    const actindoLogs = Array.isArray(job.actindoLogs) ? job.actindoLogs : [];
    renderActindoLogs(actindoLogs);

    if (jobFeedbackEl) {
        if (job.success) {
            jobFeedbackEl.textContent = 'Job erfolgreich abgeschlossen.';
            jobFeedbackEl.classList.remove('job-details__feedback--error');
            jobFeedbackEl.classList.add('job-details__feedback--success');
        } else {
            const message = extractErrorMessage(job.errorPayload ?? job.responsePayload);
            jobFeedbackEl.textContent = `Fehler: ${message}`;
            jobFeedbackEl.classList.add('job-details__feedback--error');
            jobFeedbackEl.classList.remove('job-details__feedback--success');
        }
    }
}

function prettifyJson(payload) {
    if (!payload) return '{}';
    try {
        const parsed = JSON.parse(payload);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return payload;
    }
}

function formatDuration(ms) {
    if (typeof ms !== 'number') return '-';
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
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

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function extractErrorMessage(payload) {
    if (!payload) return 'Keine Fehlermeldung vorhanden.';
    try {
        const parsed = JSON.parse(payload);
        if (typeof parsed === 'string') return parsed;
        if (parsed?.error) return parsed.error;
        if (parsed?.message) return parsed.message;
        return JSON.stringify(parsed, null, 2);
    } catch {
        return payload;
    }
}

function showError(message) {
    if (!alertBox) return;
    alertBox.textContent = `Live-Update fehlgeschlagen: ${message}`;
    alertBox.classList.add('alert--visible');
}

function hideError() {
    if (!alertBox) return;
    alertBox.classList.remove('alert--visible');
}

function openReplayModal() {
    if (!selectedJobId || !modal || !replayEditor) return;
    if (!permissions.canWrite) {
        showError('Keine Berechtigung: Replay ist nur fuer write/admin erlaubt.');
        return;
    }
    const job = jobsCache.find((item) => item.id === selectedJobId);
    if (!job) return;

    modalJobId = job.id;
    replayEditor.value = job.requestPayload ?? '{}';
    if (modalFeedback) {
        modalFeedback.textContent = '';
        modalFeedback.classList.remove('modal__feedback--error', 'modal__feedback--success');
    }
    modal.removeAttribute('hidden');
    modal.classList.add('modal--visible');
    replayEditor.focus();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('modal--visible');
    modal.setAttribute('hidden', 'hidden');
    modalJobId = null;
}

async function submitReplay() {
    if (!modalJobId || !replayEditor) return;
    if (!permissions.canWrite) {
        setModalFeedback('Keine Berechtigung: Replay ist nur fuer write/admin erlaubt.', true);
        return;
    }
    const payloadRaw = replayEditor.value.trim();
    if (!payloadRaw) {
        setModalFeedback('Payload darf nicht leer sein', true);
        return;
    }

    if (!isValidJson(payloadRaw)) {
        setModalFeedback('Ungueltiges JSON. Bitte pruefen.', true);
        return;
    }

    try {
        const response = await fetch(`/dashboard/jobs/${modalJobId}/replay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: payloadRaw })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Replay fehlgeschlagen (${response.status})`);
        }

        setModalFeedback('Replay wurde gesendet. Warte auf Ergebnis...', false);
        closeModal();
        if (jobFeedbackEl) {
            jobFeedbackEl.textContent = 'Replay erfolgreich gesendet.';
            jobFeedbackEl.classList.remove('job-details__feedback--error');
        }

        await Promise.all([loadJobs(), loadSummary()]);
    } catch (error) {
        setModalFeedback(error instanceof Error ? error.message : 'Replay fehlgeschlagen', true);
        console.error('Replay failed', error);
    }
}

function setModalFeedback(message, isError) {
    if (!modalFeedback) return;
    modalFeedback.textContent = message;
    modalFeedback.classList.toggle('modal__feedback--error', Boolean(isError));
    modalFeedback.classList.toggle('modal__feedback--success', !isError);
}

async function copyToClipboard(text) {
    const payload = text ?? '';
    if (!payload) return false;

    if (navigator?.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(payload);
            return true;
        } catch {
            // fall through to legacy
        }
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = payload;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return Boolean(success);
    } catch {
        return false;
    }
}

function flashCopyButton(button, success) {
    if (!button) return;
    const original = button.textContent ?? 'Copy';
    button.textContent = success ? 'Copied' : 'Copy failed';
    button.disabled = true;
    setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
    }, 1200);
}

function renderActindoLogs(logs) {
    if (!actindoLogsContainer) return;

    if (!logs || logs.length === 0) {
        actindoLogsContainer.innerHTML = '<p>Keine Actindo-Aufrufe vorhanden.</p>';
        return;
    }

    actindoLogsContainer.innerHTML = '';
    logs.forEach((log) => {
        const item = document.createElement('div');
        item.className = 'logs-list__item';

        const header = document.createElement('div');
        header.className = 'logs-list__header';
        header.innerHTML =
            `<span>${escapeHtml(log.endpoint)}</span><span>${formatDate(log.createdAt)}</span>`;

        const status = document.createElement('span');
        status.className = log.success ? 'badge badge--success' : 'badge badge--error';
        status.textContent = log.success ? 'OK' : 'Fehler';
        header.appendChild(status);

        item.appendChild(header);

        const payloadGrid = document.createElement('div');
        payloadGrid.className = 'logs-list__payload-grid';

        const requestWrapper = document.createElement('div');
        requestWrapper.className = 'logs-list__payload-wrapper';

        const requestBlock = document.createElement('div');
        requestBlock.className = 'logs-list__payload-block';
        requestBlock.innerHTML = '<strong>Request</strong><pre><code></code></pre>';
        const requestCode = requestBlock.querySelector('code');
        const requestText = prettifyJson(log.requestPayload);
        requestCode.textContent = requestText;

        const requestActions = document.createElement('div');
        requestActions.className = 'code-block__actions';
        const requestCopyBtn = document.createElement('button');
        requestCopyBtn.className = 'button button--ghost button--small';
        requestCopyBtn.type = 'button';
        requestCopyBtn.textContent = 'Copy';
        requestCopyBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const ok = await copyToClipboard(requestText);
            flashCopyButton(requestCopyBtn, ok);
        });
        requestActions.appendChild(requestCopyBtn);

        requestWrapper.appendChild(requestBlock);
        requestWrapper.appendChild(requestActions);

        const responseWrapper = document.createElement('div');
        responseWrapper.className = 'logs-list__payload-wrapper';

        const responseBlock = document.createElement('div');
        responseBlock.className = 'logs-list__payload-block';
        responseBlock.innerHTML = '<strong>Response</strong><pre><code></code></pre>';
        const responseCode = responseBlock.querySelector('code');
        const responseText = prettifyJson(
            log.responsePayload ?? (log.success ? '{}' : 'Fehler ohne Payload'));
        responseCode.textContent = responseText;

        const responseActions = document.createElement('div');
        responseActions.className = 'code-block__actions';
        const responseCopyBtn = document.createElement('button');
        responseCopyBtn.className = 'button button--ghost button--small';
        responseCopyBtn.type = 'button';
        responseCopyBtn.textContent = 'Copy';
        responseCopyBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const ok = await copyToClipboard(responseText);
            flashCopyButton(responseCopyBtn, ok);
        });
        responseActions.appendChild(responseCopyBtn);

        responseWrapper.appendChild(responseBlock);
        responseWrapper.appendChild(responseActions);

        payloadGrid.appendChild(requestWrapper);
        payloadGrid.appendChild(responseWrapper);
        item.appendChild(payloadGrid);

        actindoLogsContainer.appendChild(item);
    });
}

function isValidJson(text) {
    try {
        JSON.parse(text);
        return true;
    } catch {
        return false;
    }
}

if (replayBtn) {
    replayBtn.addEventListener('click', () => {
        if (!selectedJobId) return;
        openReplayModal();
    });
}

if (refreshJobsBtn) {
    refreshJobsBtn.addEventListener('click', () => {
        loadJobs();
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        clearJobHistory();
    });
}

if (copyJobRequestBtn) {
    copyJobRequestBtn.addEventListener('click', async () => {
        const ok = await copyToClipboard(jobRequestCode?.textContent ?? '');
        flashCopyButton(copyJobRequestBtn, ok);
    });
}

if (copyJobResponseBtn) {
    copyJobResponseBtn.addEventListener('click', async () => {
        const ok = await copyToClipboard(jobResponseCode?.textContent ?? '');
        flashCopyButton(copyJobResponseBtn, ok);
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}

if (modalSubmitBtn) {
    modalSubmitBtn.addEventListener('click', submitReplay);
}

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}

const loggedIn = await requireLogin();
if (loggedIn) {
    loadSummary();
    setInterval(loadSummary, REFRESH_INTERVAL_MS);

    if (pageHasJobs) {
        loadJobs();
        setInterval(loadJobs, REFRESH_INTERVAL_MS);

        if (replayBtn) replayBtn.toggleAttribute('disabled', !permissions.canWrite);
        if (clearHistoryBtn) clearHistoryBtn.toggleAttribute('disabled', !permissions.canWrite);
    }
}

async function clearJobHistory() {
    if (!pageHasJobs) return;
    if (!permissions.canWrite) {
        showError('Keine Berechtigung: Loeschen ist nur fuer write/admin erlaubt.');
        return;
    }
    const confirmed = window.confirm('Gesamte Job-Historie wirklich loeschen?');
    if (!confirmed) return;

    try {
        const response = await fetch('/dashboard/jobs', { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Loeschen fehlgeschlagen (${response.status})`);
        }

        jobsCache = [];
        selectedJobId = null;
        renderJobs();
        if (jobFeedbackEl) {
            jobFeedbackEl.textContent = 'Job-Historie wurde geloescht.';
            jobFeedbackEl.classList.remove('job-details__feedback--error');
            jobFeedbackEl.classList.add('job-details__feedback--success');
        }

        await loadSummary();
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Historie konnte nicht geloescht werden.');
        console.error('Clear job history failed', error);
    }
}

async function deleteSingleJob(jobId) {
    if (!pageHasJobs) return;
    if (!jobId) return;
    if (!permissions.canWrite) {
        showError('Keine Berechtigung: Loeschen ist nur fuer write/admin erlaubt.');
        return;
    }

    const confirmed = window.confirm('Diesen Job wirklich loeschen?');
    if (!confirmed) return;

    try {
        const response = await fetch(`/dashboard/jobs/${encodeURIComponent(jobId)}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Loeschen fehlgeschlagen (${response.status})`);
        }

        jobsCache = jobsCache.filter((job) => job.id !== jobId);
        if (selectedJobId === jobId) {
            selectedJobId = jobsCache.length ? jobsCache[0].id : null;
        }

        renderJobs();

        if (jobFeedbackEl) {
            jobFeedbackEl.textContent = 'Job wurde geloescht.';
            jobFeedbackEl.classList.remove('job-details__feedback--error');
            jobFeedbackEl.classList.add('job-details__feedback--success');
        }

        await loadSummary();
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Job konnte nicht geloescht werden.');
        console.error('Delete single job failed', error);
    }
}

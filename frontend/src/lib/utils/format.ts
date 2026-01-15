export function formatDate(value: string | null | undefined): string {
	if (!value) return '-';
	const date = new Date(value);
	if (isNaN(date.getTime())) return '-';
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

export function formatDateShort(value: string | null | undefined): string {
	if (!value) return '-';
	const date = new Date(value);
	if (isNaN(date.getTime())) return '-';
	return date.toLocaleString('de-DE', {
		hour12: false,
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatDuration(ms: number | null | undefined): string {
	if (typeof ms !== 'number') return '-';
	if (ms < 1000) return `${ms} ms`;
	return `${(ms / 1000).toFixed(1)} s`;
}

export function prettifyJson(payload: string | null | undefined): string {
	if (!payload) return '{}';
	try {
		const parsed = JSON.parse(payload);
		return JSON.stringify(parsed, null, 2);
	} catch {
		return payload;
	}
}

export function truncate(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length) + '...';
}

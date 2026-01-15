<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';

	interface Props {
		code: string;
		error?: boolean;
		maxHeight?: string;
		class?: string;
	}

	let { code, error = false, maxHeight = '360px', class: className = '' }: Props = $props();

	let copied = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = code;
			textarea.style.position = 'fixed';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div class="relative group {className}">
	<pre
		class="
			p-4 rounded-xl overflow-auto font-mono text-sm
			bg-black/40 border
			{error ? 'border-red-500/50 shadow-lg shadow-red-500/20' : 'border-white/10'}
		"
		style="max-height: {maxHeight}"
	><code class="text-gray-300 whitespace-pre-wrap break-words">{code}</code></pre>

	<button
		type="button"
		class="
			absolute top-2 right-2
			p-2 rounded-lg
			bg-dark-700/80 border border-white/10
			text-gray-400 hover:text-white
			opacity-0 group-hover:opacity-100
			transition-all
		"
		onclick={copyToClipboard}
	>
		{#if copied}
			<Check size={16} class="text-emerald-400" />
		{:else}
			<Copy size={16} />
		{/if}
	</button>
</div>

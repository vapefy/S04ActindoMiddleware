<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';

	interface Props {
		variant?: 'error' | 'success' | 'warning' | 'info';
		dismissible?: boolean;
		class?: string;
		ondismiss?: () => void;
		children: Snippet;
	}

	let {
		variant = 'info',
		dismissible = false,
		class: className = '',
		ondismiss,
		children
	}: Props = $props();

	const variantClasses = {
		error: 'bg-red-500/10 border-red-500/40 text-red-400',
		success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
		warning: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
		info: 'bg-royal-500/10 border-royal-500/40 text-royal-300'
	};
</script>

<div
	class="
		flex items-start gap-3 px-4 py-3 rounded-xl border
		animate-fade-in
		{variantClasses[variant]}
		{className}
	"
	role="alert"
>
	<div class="flex-1 text-sm">{@render children()}</div>
	{#if dismissible}
		<button
			type="button"
			class="p-1 rounded-lg hover:bg-white/10 transition-colors"
			onclick={ondismiss}
		>
			<X size={16} />
		</button>
	{/if}
</div>

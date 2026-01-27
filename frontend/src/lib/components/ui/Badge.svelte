<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'success' | 'error' | 'warning' | 'pending' | 'default' | 'primary' | 'info' | 'secondary';
		class?: string;
		children: Snippet;
	}

	let { variant = 'default', class: className = '', children }: Props = $props();

	const variantClasses = {
		success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
		error: 'bg-red-500/20 text-red-400 border-red-500/30',
		warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
		pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
		default: 'bg-white/10 text-gray-300 border-white/20',
		primary: 'bg-royal-500/20 text-royal-300 border-royal-500/30',
		info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
		secondary: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
	};
</script>

<span
	class="
		inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
		uppercase tracking-wider border
		{variantClasses[variant]}
		{className}
	"
>
	{@render children()}
</span>

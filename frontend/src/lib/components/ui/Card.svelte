<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		hover?: boolean;
		children: Snippet;
	}

	let { class: className = '', hover = false, children }: Props = $props();
</script>

<div
	class="
		glass-card p-6
		{hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:border-royal-700/50' : ''}
		{className}
	"
>
	{@render children()}
</div>

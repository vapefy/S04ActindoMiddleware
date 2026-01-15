<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'ghost' | 'danger';
		size?: 'default' | 'small';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'default',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = `
		inline-flex items-center justify-center gap-2 font-semibold rounded-full
		transition-all duration-150 cursor-pointer
		disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
	`;

	const variantClasses = {
		primary: `
			bg-royal-600 text-white
			shadow-lg shadow-royal-600/30
			hover:translate-y-[-2px] hover:shadow-xl hover:shadow-royal-600/40
			active:translate-y-0
		`,
		ghost: `
			bg-transparent border border-white/20 text-white
			hover:bg-white/5 hover:border-white/30
		`,
		danger: `
			bg-red-500/20 border border-red-500/50 text-red-400
			shadow-lg shadow-red-500/20
			hover:bg-red-500/30 hover:shadow-xl hover:shadow-red-500/30
		`
	};

	const sizeClasses = {
		default: 'px-5 py-2.5 text-sm',
		small: 'px-3 py-1.5 text-xs'
	};
</script>

<button
	{type}
	{disabled}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
	{onclick}
>
	{@render children()}
</button>

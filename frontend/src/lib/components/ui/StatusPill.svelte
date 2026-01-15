<script lang="ts">
	interface Props {
		state: 'ok' | 'warning' | 'error' | 'unknown';
		label: string;
		tooltip?: string;
	}

	let { state, label, tooltip = '' }: Props = $props();

	const stateClasses = {
		ok: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
		warning: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
		error: 'bg-red-500/15 border-red-500/40 text-red-400',
		unknown: 'bg-white/10 border-white/20 text-gray-400'
	};

	const dotClasses = {
		ok: 'bg-emerald-400',
		warning: 'bg-amber-400',
		error: 'bg-red-400',
		unknown: 'bg-gray-500'
	};
</script>

<div
	class="
		inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
		border {stateClasses[state]}
	"
	title={tooltip}
>
	<span
		class="
			w-2 h-2 rounded-full
			{dotClasses[state]}
			{state === 'ok' ? 'animate-pulse-slow' : ''}
		"
	></span>
	<span>{label}</span>
</div>

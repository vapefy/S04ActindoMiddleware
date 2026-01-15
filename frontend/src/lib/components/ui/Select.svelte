<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		id?: string;
		options: Option[];
		value?: string;
		disabled?: boolean;
		class?: string;
		onchange?: (e: Event & { currentTarget: HTMLSelectElement }) => void;
	}

	let {
		id,
		options,
		value = $bindable(''),
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();
</script>

<select
	{id}
	bind:value
	{disabled}
	class="
		w-full px-4 py-2.5 rounded-xl
		bg-black/30 border border-white/10
		text-white outline-none cursor-pointer
		transition-all
		focus:border-royal-400/60 focus:ring-4 focus:ring-royal-400/10
		disabled:opacity-50 disabled:cursor-not-allowed
		{className}
	"
	{onchange}
>
	{#each options as option}
		<option value={option.value} class="bg-dark-800">{option.label}</option>
	{/each}
</select>

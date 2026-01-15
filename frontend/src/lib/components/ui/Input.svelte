<script lang="ts">
	interface Props {
		type?: 'text' | 'password' | 'email' | 'number' | 'search';
		id?: string;
		name?: string;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		autocomplete?: string;
		class?: string;
		oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
	}

	let {
		type = 'text',
		id,
		name,
		placeholder,
		value = $bindable(''),
		disabled = false,
		required = false,
		autocomplete,
		class: className = '',
		oninput
	}: Props = $props();
</script>

<input
	{type}
	{id}
	{name}
	{placeholder}
	bind:value
	{disabled}
	{required}
	autocomplete={autocomplete as any}
	class="input {className}"
	{oninput}
/>

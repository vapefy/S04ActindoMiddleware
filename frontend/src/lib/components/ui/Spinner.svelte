<script lang="ts">
	interface Props {
		size?: 'small' | 'default' | 'large';
		class?: string;
	}

	let { size = 'default', class: className = '' }: Props = $props();

	const sizeClasses = {
		small: 'w-4 h-4 border-2',
		default: 'w-8 h-8 border-3',
		large: 'w-12 h-12 border-4'
	};
</script>

<div
	class="
		rounded-full border-royal-400/30 border-t-royal-400
		animate-spin
		{sizeClasses[size]}
		{className}
	"
></div>

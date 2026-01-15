<script lang="ts">
	import { formatDateShort } from '$utils/format';

	interface Props {
		activeJobs: number;
		generatedAt: string;
	}

	let { activeJobs, generatedAt }: Props = $props();
</script>

<section
	class="
		relative overflow-hidden
		p-8 rounded-3xl
		bg-gradient-to-br from-royal-800/90 to-royal-900/90
		border border-white/10
		shadow-2xl shadow-royal-900/50
	"
>
	<!-- Background decoration -->
	<div
		class="absolute inset-0 opacity-30"
		style="background-image: radial-gradient(circle at 80% 20%, rgba(59, 160, 255, 0.3), transparent 50%)"
	></div>

	<div class="relative grid md:grid-cols-3 gap-8 items-center">
		<div class="md:col-span-2">
			<h1 class="text-3xl md:text-4xl font-bold tracking-tight">
				Realtime Sync Monitor
			</h1>
			<p class="mt-2 text-lg text-royal-200/80">
				Koenigsblaues Cockpit fuer deine Actindo-Jobs
			</p>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-1 gap-4">
			<div>
				<p class="text-xs uppercase tracking-wider text-royal-300/70">Aktive Jobs</p>
				<p class="text-4xl md:text-5xl font-bold">{activeJobs}</p>
			</div>
			<div>
				<p class="text-xs uppercase tracking-wider text-royal-300/70">Letzte Aktualisierung</p>
				<p class="text-lg md:text-xl font-medium text-royal-100/80">
					{formatDateShort(generatedAt)}
				</p>
			</div>
		</div>
	</div>
</section>

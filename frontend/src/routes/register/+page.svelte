<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$api/client';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Card from '$components/ui/Card.svelte';

	let username = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let error = $state('');
	let loading = $state(false);
	let success = $state(false);

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();

		if (!username.trim() || !password.trim()) {
			error = 'Bitte alle Felder ausfuellen';
			return;
		}

		if (password !== passwordConfirm) {
			error = 'Passwoerter stimmen nicht ueberein';
			return;
		}

		if (password.length < 6) {
			error = 'Passwort muss mindestens 6 Zeichen lang sein';
			return;
		}

		loading = true;
		error = '';

		try {
			await auth.register({ username, password });
			success = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Registrieren | Actindo Middleware</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Brand -->
		<div class="text-center mb-6">
			<div class="inline-flex items-center gap-3 mb-4">
				<div
					class="
						w-12 h-12 rounded-2xl
						bg-gradient-to-br from-royal-400 to-royal-700
						shadow-lg shadow-royal-600/40
						border border-white/10
					"
				></div>
				<div class="text-left">
					<p class="font-bold tracking-wider uppercase">Actindo Middleware</p>
					<p class="text-sm text-gray-400">Registrierung</p>
				</div>
			</div>
		</div>

		<Card class="gradient-border">
			{#if success}
				<div class="text-center py-4">
					<div
						class="
							w-16 h-16 mx-auto mb-4 rounded-full
							bg-emerald-500/20 border border-emerald-500/40
							flex items-center justify-center
						"
					>
						<svg class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="text-xl font-semibold mb-2">Registrierung erfolgreich!</h2>
					<p class="text-gray-400 mb-6">
						Dein Antrag wurde eingereicht. Ein Administrator wird dich freischalten.
					</p>
					<Button onclick={() => goto('/login')}>Zur Anmeldung</Button>
				</div>
			{:else}
				<h2 class="text-xl font-semibold mb-1">Registrieren</h2>
				<p class="text-sm text-gray-400 mb-4">
					Erstelle einen Account. Ein Admin muss dich freischalten.
				</p>

				{#if error}
					<Alert variant="error" class="mb-4">{error}</Alert>
				{/if}

				<form onsubmit={handleRegister} class="space-y-4">
					<div>
						<label class="label" for="username">Benutzername</label>
						<Input
							id="username"
							bind:value={username}
							placeholder="username"
							autocomplete="username"
							required
						/>
					</div>
					<div>
						<label class="label" for="password">Passwort</label>
						<Input
							id="password"
							type="password"
							bind:value={password}
							placeholder="********"
							autocomplete="new-password"
							required
						/>
					</div>
					<div>
						<label class="label" for="password-confirm">Passwort bestaetigen</label>
						<Input
							id="password-confirm"
							type="password"
							bind:value={passwordConfirm}
							placeholder="********"
							autocomplete="new-password"
							required
						/>
					</div>
					<Button type="submit" disabled={loading} class="w-full">
						{loading ? 'Registriere...' : 'Registrieren'}
					</Button>
				</form>

				<div class="mt-6 pt-4 border-t border-white/10 text-center">
					<p class="text-sm text-gray-400">
						Bereits einen Account?
						<a href="/login" class="link">Anmelden</a>
					</p>
				</div>
			{/if}
		</Card>
	</div>
</div>

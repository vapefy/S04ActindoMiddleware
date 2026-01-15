<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$api/client';
	import { authStore } from '$stores/auth';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Card from '$components/ui/Card.svelte';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// Bootstrap state
	let bootstrapNeeded = $state(false);
	let bootstrapUsername = $state('');
	let bootstrapPassword = $state('');
	let bootstrapLoading = $state(false);
	let bootstrapError = $state('');
	let bootstrapSuccess = $state(false);

	onMount(async () => {
		try {
			const result = await auth.bootstrapNeeded();
			bootstrapNeeded = result.needed;
		} catch {
			// Ignore
		}
	});

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		if (!username.trim() || !password.trim()) return;

		loading = true;
		error = '';

		try {
			await authStore.login(username, password);
			const returnUrl = $page.url.searchParams.get('returnUrl') ?? '/';
			goto(returnUrl);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login fehlgeschlagen';
		} finally {
			loading = false;
		}
	}

	async function handleBootstrap(e: SubmitEvent) {
		e.preventDefault();
		if (!bootstrapUsername.trim() || !bootstrapPassword.trim()) return;

		bootstrapLoading = true;
		bootstrapError = '';

		try {
			await auth.bootstrap({
				username: bootstrapUsername,
				password: bootstrapPassword
			});
			bootstrapSuccess = true;
			bootstrapNeeded = false;
			// Pre-fill login form
			username = bootstrapUsername;
			password = bootstrapPassword;
		} catch (err) {
			bootstrapError = err instanceof Error ? err.message : 'Bootstrap fehlgeschlagen';
		} finally {
			bootstrapLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login | Actindo Middleware</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<!-- Brand -->
		<div class="text-center">
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
					<p class="text-sm text-gray-400">Dashboard Login</p>
				</div>
			</div>
		</div>

		<!-- Bootstrap Card -->
		{#if bootstrapNeeded && !bootstrapSuccess}
			<Card class="gradient-border">
				<h2 class="text-xl font-semibold mb-1">Erster Start</h2>
				<p class="text-sm text-gray-400 mb-4">
					Es existieren noch keine Benutzer. Erstelle den ersten Admin-Account.
				</p>

				{#if bootstrapError}
					<Alert variant="error" class="mb-4">{bootstrapError}</Alert>
				{/if}

				<form onsubmit={handleBootstrap} class="space-y-4">
					<div>
						<label class="label" for="bootstrap-username">Benutzername</label>
						<Input
							id="bootstrap-username"
							bind:value={bootstrapUsername}
							placeholder="admin"
							autocomplete="username"
							required
						/>
					</div>
					<div>
						<label class="label" for="bootstrap-password">Passwort</label>
						<Input
							id="bootstrap-password"
							type="password"
							bind:value={bootstrapPassword}
							placeholder="********"
							autocomplete="new-password"
							required
						/>
					</div>
					<Button type="submit" disabled={bootstrapLoading} class="w-full">
						{bootstrapLoading ? 'Erstelle...' : 'Admin erstellen'}
					</Button>
				</form>
			</Card>
		{/if}

		<!-- Login Card -->
		<Card class="gradient-border">
			<h2 class="text-xl font-semibold mb-1">Anmelden</h2>
			<p class="text-sm text-gray-400 mb-4">
				Melde dich mit deinem Account an
			</p>

			{#if error}
				<Alert variant="error" class="mb-4">{error}</Alert>
			{/if}

			{#if bootstrapSuccess}
				<Alert variant="success" class="mb-4">
					Admin-Account erstellt! Du kannst dich jetzt anmelden.
				</Alert>
			{/if}

			<form onsubmit={handleLogin} class="space-y-4">
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
						autocomplete="current-password"
						required
					/>
				</div>
				<Button type="submit" disabled={loading} class="w-full">
					{loading ? 'Anmelden...' : 'Anmelden'}
				</Button>
			</form>

			<div class="mt-6 pt-4 border-t border-white/10 text-center">
				<p class="text-sm text-gray-400">
					Noch kein Account?
					<a href="/register" class="link">Registrieren</a>
				</p>
			</div>
		</Card>
	</div>
</div>

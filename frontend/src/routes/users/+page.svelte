<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { RefreshCw, UserPlus, Trash2, Check, X, UserCircle } from 'lucide-svelte';
	import { users as usersApi, registrations as registrationsApi } from '$api/client';
	import type { UserDto, Registration } from '$api/types';
	import { permissions } from '$stores/auth';
	import { formatDate } from '$utils/format';
	import PageHeader from '$components/layout/PageHeader.svelte';
	import Card from '$components/ui/Card.svelte';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Select from '$components/ui/Select.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import Alert from '$components/ui/Alert.svelte';
	import Spinner from '$components/ui/Spinner.svelte';

	let perms = $derived($permissions);

	let usersList: UserDto[] = $state([]);
	let registrationsList: Registration[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	// New user form
	let newUsername = $state('');
	let newPassword = $state('');
	let newRole = $state('read');
	let createLoading = $state(false);
	let createError = $state('');

	// Registration approval roles
	let approvalRoles: Record<string, string> = $state({});

	const roleOptions = [
		{ value: 'read', label: 'Read' },
		{ value: 'write', label: 'Write' },
		{ value: 'admin', label: 'Admin' }
	];

	onMount(() => {
		if (!perms.isAdmin) {
			goto('/');
			return;
		}
		loadData();
	});

	async function loadData() {
		loading = true;
		error = '';
		try {
			const [users, regs] = await Promise.all([usersApi.list(), registrationsApi.list()]);
			usersList = users;
			registrationsList = regs;
			// Initialize approval roles for each registration
			regs.forEach((r) => {
				if (!approvalRoles[r.id]) approvalRoles[r.id] = 'read';
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Fehler beim Laden';
		} finally {
			loading = false;
		}
	}

	async function handleCreateUser(e: SubmitEvent) {
		e.preventDefault();
		if (!newUsername.trim() || !newPassword.trim()) return;

		createLoading = true;
		createError = '';

		try {
			await usersApi.create({
				username: newUsername,
				password: newPassword,
				role: newRole as 'read' | 'write' | 'admin'
			});
			newUsername = '';
			newPassword = '';
			newRole = 'read';
			loadData();
		} catch (err) {
			createError = err instanceof Error ? err.message : 'Fehler beim Erstellen';
		} finally {
			createLoading = false;
		}
	}

	async function handleRoleChange(userId: string, role: string) {
		try {
			await usersApi.setRole(userId, { role: role as 'read' | 'write' | 'admin' });
			loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Aendern');
		}
	}

	async function handleDeleteUser(userId: string) {
		if (!confirm('User wirklich loeschen?')) return;
		try {
			await usersApi.delete(userId);
			loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Loeschen');
		}
	}

	async function handleApproveRegistration(regId: string, role: string) {
		try {
			await registrationsApi.approve(regId, { role: role as 'read' | 'write' | 'admin' });
			loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Genehmigen');
		}
	}

	async function handleRejectRegistration(regId: string) {
		if (!confirm('Registrierung ablehnen?')) return;
		try {
			await registrationsApi.reject(regId);
			loadData();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Fehler beim Ablehnen');
		}
	}
</script>

<svelte:head>
	<title>Users | Actindo Middleware</title>
</svelte:head>

<PageHeader title="Benutzerverwaltung" subtitle="Benutzer und Registrierungen verwalten">
	{#snippet actions()}
		<Button variant="ghost" onclick={loadData} disabled={loading}>
			<RefreshCw size={16} class={loading ? 'animate-spin' : ''} />
			Aktualisieren
		</Button>
	{/snippet}
</PageHeader>

{#if error}
	<Alert variant="error" class="mb-6">{error}</Alert>
{/if}

<div class="grid lg:grid-cols-3 gap-6">
	<!-- Create User -->
	<Card>
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<UserPlus size={20} />
			Neuer Benutzer
		</h3>

		{#if createError}
			<Alert variant="error" class="mb-4">{createError}</Alert>
		{/if}

		<form onsubmit={handleCreateUser} class="space-y-4">
			<div>
				<label class="label" for="new-username">Benutzername</label>
				<Input id="new-username" bind:value={newUsername} placeholder="username" required />
			</div>
			<div>
				<label class="label" for="new-password">Passwort</label>
				<Input
					id="new-password"
					type="password"
					bind:value={newPassword}
					placeholder="********"
					required
				/>
			</div>
			<div>
				<label class="label" for="new-role">Rolle</label>
				<Select id="new-role" options={roleOptions} bind:value={newRole} />
			</div>
			<Button type="submit" disabled={createLoading} class="w-full">
				{createLoading ? 'Erstelle...' : 'Benutzer erstellen'}
			</Button>
		</form>
	</Card>

	<!-- Users List -->
	<Card class="lg:col-span-2">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<UserCircle size={20} />
			Benutzer ({usersList.length})
		</h3>

		{#if loading && usersList.length === 0}
			<div class="flex justify-center py-8">
				<Spinner />
			</div>
		{:else if usersList.length === 0}
			<p class="text-center py-8 text-gray-400">Keine Benutzer vorhanden</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-white/10">
							<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
								Benutzer
							</th>
							<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
								Rolle
							</th>
							<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
								Erstellt
							</th>
							<th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
								Aktionen
							</th>
						</tr>
					</thead>
					<tbody>
						{#each usersList as user}
							<tr class="border-b border-white/5">
								<td class="py-3 px-4 font-medium">{user.username}</td>
								<td class="py-3 px-4">
									<Select
										options={roleOptions}
										value={user.role}
										onchange={(e) => handleRoleChange(user.id, e.currentTarget.value)}
										class="w-28"
									/>
								</td>
								<td class="py-3 px-4 text-sm text-gray-400">
									{formatDate(user.createdAt)}
								</td>
								<td class="py-3 px-4 text-right">
									<Button
										variant="danger"
										size="small"
										onclick={() => handleDeleteUser(user.id)}
									>
										<Trash2 size={14} />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card>
</div>

<!-- Pending Registrations -->
{#if registrationsList.length > 0}
	<Card class="mt-6">
		<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
			<Badge variant="warning">{registrationsList.length}</Badge>
			Offene Registrierungen
		</h3>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-white/10">
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
							Benutzer
						</th>
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
							Angefragt am
						</th>
						<th class="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
							Rolle
						</th>
						<th class="text-right py-3 px-4 text-xs uppercase tracking-wider text-gray-400">
							Aktionen
						</th>
					</tr>
				</thead>
				<tbody>
					{#each registrationsList as reg}
						<tr class="border-b border-white/5">
							<td class="py-3 px-4 font-medium">{reg.username}</td>
							<td class="py-3 px-4 text-sm text-gray-400">
								{formatDate(reg.createdAt)}
							</td>
							<td class="py-3 px-4">
								<Select
									options={roleOptions}
									value={approvalRoles[reg.id] ?? 'read'}
									onchange={(e) => (approvalRoles[reg.id] = e.currentTarget.value)}
									class="w-28"
								/>
							</td>
							<td class="py-3 px-4">
								<div class="flex justify-end gap-2">
									<Button
										size="small"
										onclick={() => handleApproveRegistration(reg.id, approvalRoles[reg.id] ?? 'read')}
									>
										<Check size={14} />
										Genehmigen
									</Button>
									<Button
										variant="danger"
										size="small"
										onclick={() => handleRejectRegistration(reg.id)}
									>
										<X size={14} />
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
{/if}

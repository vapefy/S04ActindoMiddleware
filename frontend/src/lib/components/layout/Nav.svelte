<script lang="ts">
	import { page } from '$app/stores';
	import { LogOut, LayoutDashboard, Package, Users, Settings, Activity, UserCircle, ArrowRightLeft } from 'lucide-svelte';
	import { authStore, permissions, currentUser } from '$stores/auth';
	import { dashboardStore } from '$stores/dashboard';
	import StatusPill from '$components/ui/StatusPill.svelte';
	import Button from '$components/ui/Button.svelte';

	let summary = $derived($dashboardStore.summary);
	let perms = $derived($permissions);
	let user = $derived($currentUser);

	interface NavLink {
		href: string;
		label: string;
		icon: typeof LayoutDashboard;
		adminOnly?: boolean;
		writeOnly?: boolean;
	}

	const links: NavLink[] = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/products', label: 'Products', icon: Package },
		{ href: '/customers', label: 'Customers', icon: Users },
		{ href: '/jobs', label: 'Jobs', icon: Activity },
		{ href: '/sync', label: 'Sync', icon: ArrowRightLeft, writeOnly: true },
		{ href: '/users', label: 'Users', icon: UserCircle, adminOnly: true },
		{ href: '/settings', label: 'Settings', icon: Settings, adminOnly: true }
	];

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}

	async function handleLogout() {
		await authStore.logout();
		window.location.href = '/login';
	}
</script>

<nav class="sticky top-0 z-40 glass border-b border-white/5">
	<div class="max-w-7xl mx-auto px-4 sm:px-6">
		<div class="flex items-center justify-between h-16 gap-4">
			<!-- Brand -->
			<div class="flex-shrink-0">
				<span class="text-lg font-bold tracking-wider uppercase text-white">
					Actindo <span class="text-royal-400">Middleware</span>
				</span>
			</div>

			<!-- Navigation Links -->
			<div class="hidden md:flex items-center gap-1">
				{#each links as link}
					{#if (!link.adminOnly || perms.isAdmin) && (!link.writeOnly || perms.canWrite)}
						<a
							href={link.href}
							class="
								flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
								uppercase tracking-wide transition-all
								{isActive(link.href)
									? 'bg-royal-600/30 text-white border border-royal-600/50'
									: 'text-gray-400 hover:text-white hover:bg-white/5'}
							"
						>
							<svelte:component this={link.icon} size={16} />
							{link.label}
						</a>
					{/if}
				{/each}
			</div>

			<!-- Status & User -->
			<div class="flex items-center gap-3">
				<div class="hidden lg:flex items-center gap-2">
					<StatusPill
						state={summary?.actindo?.state ?? 'unknown'}
						label="Actindo"
						tooltip={summary?.actindo?.message ?? 'Status wird geladen...'}
					/>
					<StatusPill
						state={summary?.oauth?.state ?? 'unknown'}
						label="Token"
						tooltip={summary?.oauth?.message ?? 'Status wird geladen...'}
					/>
				</div>

				{#if user}
					<div
						class="
							hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full
							bg-gradient-to-r from-royal-400/20 to-royal-600/20
							border border-royal-400/30
						"
					>
						<span class="w-2 h-2 rounded-full bg-royal-400 animate-pulse"></span>
						<span class="text-sm font-medium">{user.username}</span>
					</div>
				{/if}

				<Button variant="ghost" size="small" onclick={handleLogout}>
					<LogOut size={16} />
					<span class="hidden sm:inline">Logout</span>
				</Button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	<div class="md:hidden border-t border-white/5">
		<div class="flex overflow-x-auto px-4 py-2 gap-2">
			{#each links as link}
				{#if (!link.adminOnly || perms.isAdmin) && (!link.writeOnly || perms.canWrite)}
					<a
						href={link.href}
						class="
							flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
							uppercase tracking-wide whitespace-nowrap transition-all
							{isActive(link.href)
								? 'bg-royal-600/30 text-white border border-royal-600/50'
								: 'text-gray-400 hover:text-white hover:bg-white/5'}
						"
					>
						<svelte:component this={link.icon} size={14} />
						{link.label}
					</a>
				{/if}
			{/each}
		</div>
	</div>
</nav>

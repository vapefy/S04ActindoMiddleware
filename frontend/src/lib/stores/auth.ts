import { writable, derived } from 'svelte/store';
import type { User } from '$api/types';
import { auth as authApi } from '$api/client';

interface AuthState {
	user: User | null;
	loading: boolean;
	initialized: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		loading: true,
		initialized: false
	});

	return {
		subscribe,

		async init() {
			update((s) => ({ ...s, loading: true }));
			try {
				const user = await authApi.me();
				set({ user: user.authenticated ? user : null, loading: false, initialized: true });
			} catch {
				set({ user: null, loading: false, initialized: true });
			}
		},

		async login(username: string, password: string) {
			const result = await authApi.login({ username, password });
			const user: User = {
				authenticated: true,
				username: result.username,
				role: result.role as User['role']
			};
			set({ user, loading: false, initialized: true });
			return user;
		},

		async logout() {
			await authApi.logout();
			set({ user: null, loading: false, initialized: true });
		},

		setUser(user: User | null) {
			update((s) => ({ ...s, user }));
		}
	};
}

export const authStore = createAuthStore();

export const isAuthenticated = derived(authStore, ($auth) => $auth.user?.authenticated ?? false);

export const currentUser = derived(authStore, ($auth) => $auth.user);

export const permissions = derived(authStore, ($auth) => {
	const role = $auth.user?.role?.toLowerCase() ?? '';
	return {
		canRead: ['read', 'write', 'admin'].includes(role),
		canWrite: ['write', 'admin'].includes(role),
		isAdmin: role === 'admin'
	};
});

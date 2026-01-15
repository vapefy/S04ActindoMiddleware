import { d as derived, w as writable } from "./index.js";
import { b as auth } from "./client2.js";
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    loading: true,
    initialized: false
  });
  return {
    subscribe,
    async init() {
      update((s) => ({ ...s, loading: true }));
      try {
        const user = await auth.me();
        set({ user: user.authenticated ? user : null, loading: false, initialized: true });
      } catch {
        set({ user: null, loading: false, initialized: true });
      }
    },
    async login(username, password) {
      const result = await auth.login({ username, password });
      const user = {
        authenticated: true,
        username: result.username,
        role: result.role
      };
      set({ user, loading: false, initialized: true });
      return user;
    },
    async logout() {
      await auth.logout();
      set({ user: null, loading: false, initialized: true });
    },
    setUser(user) {
      update((s) => ({ ...s, user }));
    }
  };
}
const authStore = createAuthStore();
const isAuthenticated = derived(authStore, ($auth) => $auth.user?.authenticated ?? false);
const currentUser = derived(authStore, ($auth) => $auth.user);
const permissions = derived(authStore, ($auth) => {
  const role = $auth.user?.role?.toLowerCase() ?? "";
  return {
    canRead: ["read", "write", "admin"].includes(role),
    canWrite: ["write", "admin"].includes(role),
    isAdmin: role === "admin"
  };
});
export {
  authStore as a,
  currentUser as c,
  isAuthenticated as i,
  permissions as p
};

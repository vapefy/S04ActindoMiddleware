class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
async function request(url, options = {}) {
  console.log(`[API] ${options.method || "GET"} ${url}`, options.body ? JSON.parse(options.body) : "");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  console.log(`[API] ${options.method || "GET"} ${url} => ${response.status}`);
  if (response.status === 401) {
    console.warn("[API] 401 Unauthorized - redirecting to login");
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(401, "Nicht authentifiziert");
  }
  if (response.status === 403) {
    console.warn("[API] 403 Forbidden");
    throw new ApiError(403, "Keine Berechtigung");
  }
  if (!response.ok) {
    const text = await response.text();
    console.error(`[API] Error ${response.status}: ${text}`);
    throw new ApiError(response.status, text || `Request failed: ${response.status}`);
  }
  if (response.status === 204) {
    console.log("[API] 204 No Content");
    return void 0;
  }
  const json = await response.json();
  console.log(`[API] Response:`, json);
  return json;
}
const auth = {
  me: () => request("/api/auth/me"),
  bootstrapNeeded: () => request("/api/auth/bootstrap-needed"),
  bootstrap: (data) => request("/api/auth/bootstrap", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  login: (data) => request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  register: (data) => request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  logout: () => request("/api/auth/logout", {
    method: "POST"
  }),
  changePassword: (data) => request("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data)
  })
};
const dashboard = {
  summary: () => request("/api/dashboard/summary"),
  jobs: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.onlyFailed === true) searchParams.set("onlyFailed", "true");
    if (params.onlyFailed === false) searchParams.set("onlyFailed", "false");
    if (params.type) searchParams.set("type", params.type);
    return request(`/api/dashboard/jobs?${searchParams}`);
  },
  deleteAllJobs: () => request("/api/dashboard/jobs", { method: "DELETE" }),
  deleteJob: (jobId) => request(`/api/dashboard/jobs/${jobId}`, { method: "DELETE" }),
  replayJob: (jobId, payload) => request(`/api/dashboard/jobs/${jobId}/replay`, {
    method: "POST",
    body: payload ? JSON.stringify({ payload }) : void 0
  })
};
const products = {
  list: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.includeVariants) searchParams.set("includeVariants", "true");
    return request(`/api/products?${searchParams}`);
  },
  sync: (includeVariants = false) => {
    const searchParams = new URLSearchParams();
    if (includeVariants) searchParams.set("includeVariants", "true");
    return request(`/api/products/sync?${searchParams}`);
  },
  getVariants: (masterSku) => request(`/api/products/${encodeURIComponent(masterSku)}/variants`),
  getStocks: (sku) => request(`/api/products/${encodeURIComponent(sku)}/stocks`),
  delete: (data) => request("/api/products/delete", {
    method: "POST",
    body: JSON.stringify(data)
  })
};
const customers = {
  list: (limit = 200) => request(`/api/customers?limit=${limit}`)
};
const users = {
  list: () => request("/api/users"),
  create: (data) => request("/api/users", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  setRole: (userId, data) => request(`/api/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  delete: (userId) => request(`/api/users/${userId}`, { method: "DELETE" })
};
const registrations = {
  list: () => request("/api/registrations"),
  approve: (registrationId, data) => request(`/api/registrations/${registrationId}/approve`, {
    method: "POST",
    body: JSON.stringify(data)
  }),
  reject: (registrationId) => request(`/api/registrations/${registrationId}`, { method: "DELETE" })
};
const settings = {
  get: () => request("/api/settings/actindo"),
  update: (data) => request("/api/settings/actindo", {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  resetTokens: () => request("/api/actindo/auth/reset", { method: "POST" })
};
const sync = {
  status: () => request("/api/sync/status"),
  getProductStatus: () => request("/api/sync/products"),
  getCustomerStatus: () => request("/api/sync/customers"),
  syncProducts: (skus) => request("/api/sync/products", {
    method: "POST",
    body: JSON.stringify({ skus })
  }),
  syncAllProducts: () => request("/api/sync/products/all", {
    method: "POST"
  }),
  syncCustomer: (debtorNumber) => request("/api/sync/customers", {
    method: "POST",
    body: JSON.stringify({ debtorNumber })
  }),
  syncAllCustomers: () => request("/api/sync/customers/all", {
    method: "POST"
  }),
  clearProductIds: (skus) => request("/api/sync/products/clear", {
    method: "POST",
    body: JSON.stringify({ skus })
  }),
  forceSyncProducts: (skus) => request("/api/sync/products/force", {
    method: "POST",
    body: JSON.stringify({ skus })
  })
};
export {
  sync as a,
  auth as b,
  customers as c,
  dashboard as d,
  products as p,
  registrations as r,
  settings as s,
  users as u
};

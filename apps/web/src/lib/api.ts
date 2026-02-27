const API_BASE = "";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function getToken(): string | null {
  return localStorage.getItem("archflow_token");
}

export function setToken(token: string): void {
  localStorage.setItem("archflow_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("archflow_token");
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function fetchApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    },
  });
}

export async function signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
  const res = await fetchApi("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Signup failed");
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetchApi("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }
  return res.json();
}

export async function getMe(): Promise<{ user: AuthUser }> {
  const res = await fetchApi("/api/v1/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

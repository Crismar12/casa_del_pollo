const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

let refreshAccessTokenFn: (() => Promise<string | null>) | null = null;

export const setRefreshTokenFn = (fn: () => Promise<string | null>): void => {
  refreshAccessTokenFn = fn;
};

export const apiClient = {
  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): URL {
    const url = new URL(`${BACKEND_API_URL}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url;
  },

  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, options);
  },
  async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, options, body);
  },
  async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, options, body);
  },
  async patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, options, body);
  },
  async upload<T>(path: string, formData: FormData, isRetry = false): Promise<T> {
    const url = this.buildUrl(path);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: formData,
    });

    if (response.status === 401 && !isRetry && refreshAccessTokenFn) {
      const newToken = await refreshAccessTokenFn();
      if (newToken) {
        return this.upload<T>(path, formData, true);
      }
    }

    return this.handleResponse(response);
  },
  async request<T>(method: string, path: string, options?: RequestOptions, body?: unknown, isRetry = false): Promise<T> {
    const { params, ...fetchOptions } = options || {};
    const url = this.buildUrl(path, params);

    const response = await fetch(url.toString(), {
      ...fetchOptions,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !isRetry && refreshAccessTokenFn) {
      const newToken = await refreshAccessTokenFn();
      if (newToken) {
        return this.request<T>(method, path, options, body, true);
      }
    }

    return this.handleResponse(response);
  },
};

/** Frontend API routing. Keep provider credentials on the server. */
export const API_BASE = (import.meta.env.VITE_GENERATION_API_BASE || '').replace(/\/$/, '');
export const apiUrl = (path: string) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

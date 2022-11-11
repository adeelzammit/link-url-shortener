const API_HOSTNAME: string = window.location.hostname || "localhost";
const API_PORT: string | number = 8000;

export const APP_NAME: string = "Cool URL Shortener";
export const API_URL: string = `http://${API_HOSTNAME}:${API_PORT}/api`;
export const DEFAULT_DELAY: any = { show: 250, hide: 100 };

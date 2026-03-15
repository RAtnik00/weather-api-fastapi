const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const STORAGE_KEYS = {
    cookieConsent: "weather_geo_cache_consent",
};

const DEFAULT_CONSENT = "unset";

function hasValue(value) {
    const base = BASE_URL || window.location.origin;
    const url = new URL(path, base);

    if (!params || typeof params !== "object") {
        return url.toString();
    }

    for (const [key, value] of Object.entries(params)) {
        if (hasValue(value)) {
            url.searchParams.set(key, String(value));
        }
    }

    return url.toString();
}

function getCookieConsent() {
    return localStorage.getItem(STORAGE_KEYS.cookieConsent) || DEFAULT_CONSENT;
}

function buildHeaders(customHeaders = {}) {
    return {
        "Content-Type": "application/json",
        "X-Cookie-Consent": getCookieConsent(),
        ...customHeaders,
    };
}

async function parseResponseData(response) {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function buildErrorMessage(response, data) {
    return (
        (data && (data.detail || data.message)) ||
        `HTTP ${response.status} ${response.statusText}`
    );
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: buildHeaders(options.headers),
    });

    const data = await parseResponseData(response);

    if (!response.ok) {
        throw new Error(buildErrorMessage(response, data));
    }

    return { data };
}

function get(path, config = {}) {
    const url = buildUrl(path, config.params);

    return request(url, {
        method: "GET",
        headers: config.headers,
    });
}

function post(path, body, config = {}) {
    const url = buildUrl(path, config.params);

    return request(url, {
        method: "POST",
        body: JSON.stringify(body ?? {}),
        headers: config.headers,
    });
}

function remove(path, config = {}) {
    const url = buildUrl(path, config.params);

    return request(url, {
        method: "DELETE",
        headers: config.headers,
    });
}

const api = {
    get,
    post,
    delete: remove,
};

export default api;

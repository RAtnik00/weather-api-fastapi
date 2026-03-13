const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function buildUrl(path, params) {
    const url = new URL(path, BASE_URL || window.location.origin);

    if (params && typeof params === "object") {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && String(value).length > 0) {
                url.searchParams.set(key, String(value));
            }
        }
    }

    return url.toString();
}

function getCookieConsent() {
    return localStorage.getItem("weather_geo_cache_consent") || "unset";
}

async function request(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-Cookie-Consent": getCookieConsent(),
            ...(options.headers || {}),
        },
    });

    let data = null;
    const text = await res.text();

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text || null;
    }

    if (!res.ok) {
        const message =
            (data && (data.detail || data.message)) ||
            `HTTP ${res.status} ${res.statusText}`;
        throw new Error(message);
    }

    return { data };
}

const api = {
    get(path, config = {}) {
        const url = buildUrl(path, config.params);
        return request(url, { method: "GET" });
    },

    post(path, body, config = {}) {
        const url = buildUrl(path, config.params);
        return request(url, {
            method: "POST",
            body: JSON.stringify(body ?? {}),
        });
    },

    delete(path, config = {}) {
        const url = buildUrl(path, config.params);
        return request(url, { method: "DELETE" });
    },
};

export default api;

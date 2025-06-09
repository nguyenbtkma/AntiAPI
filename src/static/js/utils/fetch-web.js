const WEB_URL = 'http://localhost:5000/components';

function getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        return {'Authorization': `Bearer ${token}`};
    }
    return {};
}

async function fetchGetWeb(endpoint, params = {}, useAuth = false, responseType = 'auto') {
    let url = new URL(`${WEB_URL}${endpoint}`);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = useAuth ? getAuthHeader() : {};

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/html, */*',
                ...headers
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Check the content type header to determine how to process the response
        const contentType = response.headers.get('content-type');

        // If responseType is specified, use that instead of auto-detection
        if (responseType !== 'auto') {
            if (responseType === 'json') {
                return await response.json();
            } else if (responseType === 'text' || responseType === 'html') {
                return await response.text();
            } else {
                return response; // Return the raw response
            }
        }

        // Auto-detect the response type
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && (contentType.includes('text/html') || contentType.includes('text/plain'))) {
            return await response.text();
        } else {
            // If we can't determine the type, try JSON first, then fallback to text
            try {
                return await response.json();
            } catch (e) {
                console.warn('Response not JSON, returning as text:', e);
                // We need to clone the response because the body has already been consumed
                return await response.clone().text();
            }
        }
    } catch (error) {
        console.error('Fetch GET failed: ', error);
        throw error;
    }
}

async function fetchPostWeb(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${WEB_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch POST failed: ', error);
        throw error;
    }
}

async function fetchPutWeb(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${WEB_URL}${endpoint}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch PUT failed: ', error);
        throw error;
    }
}

async function fetchDeleteWeb(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${WEB_URL}${endpoint}`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch DELETE failed: ', error);
        throw error;
    }
}

async function fetchPatchWeb(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${WEB_URL}${endpoint}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch PATCH failed: ', error);
        throw error;
    }
}
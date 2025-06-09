const API_URL = 'http://localhost:5000/api/v1';

function getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
}

// Helper function to handle authentication errors
function handleAuthError(response) {
    if (response.status === 401) {
        // Token expired or unauthorized
        localStorage.removeItem('auth_token'); // Clear the expired token
        window.location.href = '/web/login'; // Redirect to login page
        throw new Error('Session expired. Redirecting to login...');
    }
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response;
}

async function fetchGet(endpoint, params = {}, useAuth = false) {
    let url = new URL(`${API_URL}${endpoint}`);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const headers = useAuth ? getAuthHeader() : {};

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Fetch GET failed: ', error);
        throw error;
    }
}

async function fetchPost(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        await handleAuthError(response);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch POST failed: ', error);
        throw error;
    }
}

async function fetchPut(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });

        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Fetch PUT failed: ', error);
        throw error;
    }
}

async function fetchDelete(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(body)
        });

        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Fetch DELETE failed: ', error);
        throw error;
    }
}

async function fetchPatch(endpoint, body = {}, useAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
        ...useAuth ? getAuthHeader() : {}
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body)
        });

        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Fetch PATCH failed: ', error);
        throw error;
    }
}
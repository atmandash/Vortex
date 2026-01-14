// API Configuration
// This file automatically detects the environment and sets the correct API base URL

const API_CONFIG = {
    // Automatically detect the API base URL
    getBaseURL: function () {
        // Check if we're running on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }

        // For production, use the same origin (works with proxies and deployed apps)
        return window.location.origin;
    },

    // Get the full API URL
    getAPIURL: function (endpoint) {
        const baseURL = this.getBaseURL();
        // Ensure endpoint starts with /
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        return baseURL + cleanEndpoint;
    }
};

// Export for use in other scripts
window.API_CONFIG = API_CONFIG;

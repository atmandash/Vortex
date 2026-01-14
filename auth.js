/**
 * Simple Mock Authentication for Hackathon Demo
 * Uses LocalStorage to persist session.
 */
const Auth = {
    // Key for local storage
    STORAGE_KEY: 'sepsis_user',

    /**
     * Login User
     * @param {string} id - User ID or Email
     * @param {string} password - Password (any non-empty string for demo)
     * @param {string} type - 'patient' or 'doctor'
     */
    login: (id, password, type = 'patient') => {
        if (!id || !password) {
            return { success: false, message: 'Please enter both ID and password.' };
        }

        // Simulating simple check
        if (password.length < 4) {
            return { success: false, message: 'Password must be at least 4 characters.' };
        }

        const user = {
            id: id,
            name: type === 'doctor' ? `Dr. ${id.split('@')[0]}` : `Patient ${id}`,
            role: type,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(Auth.STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
    },

    /**
     * Logout User
     */
    logout: () => {
        localStorage.removeItem(Auth.STORAGE_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Get Current User
     */
    getCurrentUser: () => {
        const stored = localStorage.getItem(Auth.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    /**
     * Check Logic (Redirect if not logged in)
     * Use this on protected pages
     */
    checkAuth: () => {
        const user = Auth.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
        }
        return user;
    }
};

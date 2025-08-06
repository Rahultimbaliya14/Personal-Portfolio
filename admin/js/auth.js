// Authentication utilities
class AuthManager {
    constructor() {
        this.API_BASE_URL = 'https://node-rahul-timbaliya.vercel.app';
        this.TOKEN_KEY = 'admin_jwt_token';
        this.TOKEN_EXPIRY_KEY = 'admin_token_expiry';
        this.init();
    }

    init() {
        // Check if we're on login page and user is already authenticated
        if (window.location.pathname.includes('login.html') && this.isAuthenticated()) {
            this.redirectToDashboard();
            return;
        }

        // If not on login page and not authenticated, redirect to login
        if (!window.location.pathname.includes('login.html') && !this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }

        // Set up form handlers if on login page
        if (window.location.pathname.includes('login.html')) {
            this.setupLoginForm();
        }
    }

    // Cookie management functions
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${location.protocol === 'https:'}`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Token management
    setToken(token) {
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 1 day
        this.setCookie(this.TOKEN_KEY, token, 1);
        this.setCookie(this.TOKEN_EXPIRY_KEY, expiryTime.toString(), 1);
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    getToken() {
        // Try cookie first, then localStorage as fallback
        let token = this.getCookie(this.TOKEN_KEY);
        if (!token) {
            token = localStorage.getItem(this.TOKEN_KEY);
        }
        return token;
    }

    removeToken() {
        this.deleteCookie(this.TOKEN_KEY);
        this.deleteCookie(this.TOKEN_EXPIRY_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    isTokenExpired() {
        const expiryTime = this.getCookie(this.TOKEN_EXPIRY_KEY) || localStorage.getItem(this.TOKEN_EXPIRY_KEY);
        if (!expiryTime) return true;
        return new Date().getTime() > parseInt(expiryTime);
    }

    isAuthenticated() {
        const token = this.getToken();
        return token && !this.isTokenExpired();
    }

    // API request with token
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        if (!token || this.isTokenExpired()) {
            this.redirectToLogin();
            throw new Error('Authentication required');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.removeToken();
            this.redirectToLogin();
            throw new Error('Session expired');
        }

        return response;
    }

    // Login functionality
    async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.data && data.data.token) {
                this.setToken(data.data.token);
                return { success: true, data };
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout() {
        this.removeToken();
        this.redirectToLogin();
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    redirectToDashboard() {
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }

    // Setup login form handlers
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        // Password toggle functionality
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = togglePassword.querySelector('i');
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            });
        }

        // Form submission
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e);
            });
        }
    }

    async handleLogin(e) {
        const loginBtn = document.getElementById('loginBtn');
        const email = document.getElementById('username').value.trim(); // Note: using username field for email
        const password = document.getElementById('password').value;

        // Remove previous error states
        removeLoginError();
        if (!email) addLoginError(document.getElementById('username'));
        if (!password) addLoginError(document.getElementById('password'));
        if (!email || !password) {
            e.preventDefault();
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            e.preventDefault();
            this.showToast('Please enter a valid email address.', 'error');
            addLoginError(document.getElementById('username'));
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            await this.login(email, password);
            this.showToast('Login successful! Redirecting...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1500);

        } catch (error) {
            this.showToast(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            // Remove loading state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // Toast notification system
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';

        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="${icon}" style="margin-right: 10px;"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Method to get user info from token (if needed)
    getUserInfo() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Decode JWT payload (basic decode, not verification)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

// --- Login Validation Helpers (feedback-style) ---
function addLoginError(input) {
    if (input) {
        input.classList.add('input-error');
        input.focus();
        input.addEventListener('animationend', function handler() {
            input.classList.remove('input-error');
            input.removeEventListener('animationend', handler);
        });
        input.addEventListener('input', function handler() {
            input.classList.remove('input-error');
            input.removeEventListener('input', handler);
        });
    }
}
function removeLoginError() {
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.classList.remove('input-error');
    if (passwordInput) passwordInput.classList.remove('input-error');
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            emailInput.classList.remove('input-error');
        });
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            passwordInput.classList.remove('input-error');
        });
    }
});

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other scripts
window.authManager = authManager;

// Additional utility functions for the admin panel
window.makeAuthenticatedRequest = (url, options = {}) => {
    return authManager.makeAuthenticatedRequest(url, options);
};

window.logout = () => {
    authManager.logout();
};

// Auto-refresh token before expiry (optional enhancement)
setInterval(() => {
    if (authManager.isAuthenticated()) {
        const expiryTime = authManager.getCookie(authManager.TOKEN_EXPIRY_KEY) || 
                          localStorage.getItem(authManager.TOKEN_EXPIRY_KEY);
        const timeLeft = parseInt(expiryTime) - new Date().getTime();
        
        // If less than 1 hour left, could implement token refresh here
        if (timeLeft < 60 * 60 * 1000) {
            console.log('Token expiring soon. Consider implementing refresh logic.');
        }
    }
}, 5 * 60 * 1000); // Check every 5 minutes

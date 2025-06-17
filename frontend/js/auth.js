class Auth {
    static async login(email, senha) {
        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            throw error;
        }
    }

    static async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('Refresh token não encontrado');
            }

            const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    static async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await fetch('http://localhost:3000/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refreshToken })
                });
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('usuario');
            window.location.href = 'login.html';
        }
    }

    static async fetch(url, options = {}) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                // Token expirado, tentar refresh
                await this.refreshToken();
                return this.fetch(url, options);
            }

            return response;
        } catch (error) {
            if (error.message === 'Token não encontrado') {
                window.location.href = 'login.html';
            }
            throw error;
        }
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getUsuario() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }
} 
/**
 * YumyTummy API Service
 * Handles all API calls to backend
 */

const API = {
    baseUrl: 'https://api.yumytummy.com/v1',
    timeout: 10000,
    
    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            data = null,
            headers = {},
            requiresAuth = true
        } = options;
        
        // Set default headers
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Add auth token if required
        if (requiresAuth) {
            const token = localStorage.getItem('yumytummy_token');
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }
        }
        
        // Merge headers
        const finalHeaders = { ...defaultHeaders, ...headers };
        
        // Prepare request options
        const requestOptions = {
            method,
            headers: finalHeaders,
            credentials: 'include'
        };
        
        // Add body if data exists
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
        
        // Create abort controller for timeout
        const controller = new AbortController();
        requestOptions.signal = controller.signal;
        
        // Set timeout
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
            clearTimeout(timeoutId);
            
            // Parse response
            const responseData = await response.json();
            
            // Handle error responses
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: responseData.message || 'An error occurred',
                    errors: responseData.errors || {}
                };
            }
            
            return {
                success: true,
                data: responseData.data,
                meta: responseData.meta
            };
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw {
                    status: 408,
                    message: 'Request timeout'
                };
            }
            
            throw error;
        }
    },
    
    /**
     * GET request
     */
    get(endpoint, params = {}, requiresAuth = true) {
        // Add query parameters
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET',
            requiresAuth
        });
    },
    
    /**
     * POST request
     */
    post(endpoint, data = {}, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'POST',
            data,
            requiresAuth
        });
    },
    
    /**
     * PUT request
     */
    put(endpoint, data = {}, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'PUT',
            data,
            requiresAuth
        });
    },
    
    /**
     * PATCH request
     */
    patch(endpoint, data = {}, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'PATCH',
            data,
            requiresAuth
        });
    },
    
    /**
     * DELETE request
     */
    delete(endpoint, requiresAuth = true) {
        return this.request(endpoint, {
            method: 'DELETE',
            requiresAuth
        });
    },
    
    /**
     * Upload file
     */
    async upload(endpoint, file, data = {}, requiresAuth = true) {
        const formData = new FormData();
        
        // Append file
        formData.append('file', file);
        
        // Append additional data
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        const token = localStorage.getItem('yumytummy_token');
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: formData,
            credentials: 'include'
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: responseData.message || 'Upload failed'
            };
        }
        
        return {
            success: true,
            data: responseData.data
        };
    },
    
    /**
     * Authentication endpoints
     */
    auth: {
        /**
         * Login
         */
        login: (email, password) => {
            return API.post('/auth/login', { email, password }, false);
        },
        
        /**
         * Register
         */
        register: (userData) => {
            return API.post('/auth/register', userData, false);
        },
        
        /**
         * Logout
         */
        logout: () => {
            return API.post('/auth/logout');
        },
        
        /**
         * Forgot password
         */
        forgotPassword: (email) => {
            return API.post('/auth/forgot-password', { email }, false);
        },
        
        /**
         * Reset password
         */
        resetPassword: (token, password) => {
            return API.post('/auth/reset-password', { token, password }, false);
        },
        
        /**
         * Verify email
         */
        verifyEmail: (token) => {
            return API.post('/auth/verify-email', { token }, false);
        },
        
        /**
         * Refresh token
         */
        refreshToken: () => {
            return API.post('/auth/refresh-token', {}, true);
        }
    },
    
    /**
     * User endpoints
     */
    user: {
        /**
         * Get current user
         */
        getCurrent: () => {
            return API.get('/user');
        },
        
        /**
         * Update profile
         */
        updateProfile: (data) => {
            return API.put('/user/profile', data);
        },
        
        /**
         * Update password
         */
        updatePassword: (data) => {
            return API.put('/user/password', data);
        },
        
        /**
         * Get addresses
         */
        getAddresses: () => {
            return API.get('/user/addresses');
        },
        
        /**
         * Add address
         */
        addAddress: (data) => {
            return API.post('/user/addresses', data);
        },
        
        /**
         * Update address
         */
        updateAddress: (id, data) => {
            return API.put(`/user/addresses/${id}`, data);
        },
        
        /**
         * Delete address
         */
        deleteAddress: (id) => {
            return API.delete(`/user/addresses/${id}`);
        }
    },
    
    /**
     * Restaurant endpoints
     */
    restaurant: {
        /**
         * Get all restaurants
         */
        getAll: (params = {}) => {
            return API.get('/restaurants', params, false);
        },
        
        /**
         * Get restaurant by ID
         */
        getById: (id) => {
            return API.get(`/restaurants/${id}`, {}, false);
        },
        
        /**
         * Get restaurant menu
         */
        getMenu: (restaurantId) => {
            return API.get(`/restaurants/${restaurantId}/menu`, {}, false);
        },
        
        /**
         * Get restaurant reviews
         */
        getReviews: (restaurantId, params = {}) => {
            return API.get(`/restaurants/${restaurantId}/reviews`, params, false);
        }
    },
    
    /**
     * Food endpoints
     */
    food: {
        /**
         * Get all foods
         */
        getAll: (params = {}) => {
            return API.get('/foods', params, false);
        },
        
        /**
         * Get food by ID
         */
        getById: (id) => {
            return API.get(`/foods/${id}`, {}, false);
        },
        
        /**
         * Get popular foods
         */
        getPopular: () => {
            return API.get('/foods/popular', {}, false);
        },
        
        /**
         * Search foods
         */
        search: (query) => {
            return API.get('/foods/search', { q: query }, false);
        }
    },
    
    /**
     * Order endpoints
     */
    order: {
        /**
         * Create order
         */
        create: (orderData) => {
            return API.post('/orders', orderData);
        },
        
        /**
         * Get order by ID
         */
        getById: (id) => {
            return API.get(`/orders/${id}`);
        },
        
        /**
         * Get user orders
         */
        getUserOrders: (params = {}) => {
            return API.get('/orders', params);
        },
        
        /**
         * Track order
         */
        track: (id) => {
            return API.get(`/orders/${id}/track`);
        },
        
        /**
         * Cancel order
         */
        cancel: (id) => {
            return API.post(`/orders/${id}/cancel`);
        }
    },
    
    /**
     * Review endpoints
     */
    review: {
        /**
         * Create review
         */
        create: (reviewData) => {
            return API.post('/reviews', reviewData);
        },
        
        /**
         * Update review
         */
        update: (id, reviewData) => {
            return API.put(`/reviews/${id}`, reviewData);
        },
        
        /**
         * Delete review
         */
        delete: (id) => {
            return API.delete(`/reviews/${id}`);
        },
        
        /**
         * Get restaurant reviews
         */
        getRestaurantReviews: (restaurantId, params = {}) => {
            return API.get(`/restaurants/${restaurantId}/reviews`, params, false);
        }
    }
};

// Make API globally available
window.API = API;
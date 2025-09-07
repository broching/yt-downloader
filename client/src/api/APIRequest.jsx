import axios from 'axios';

export class APIRequest {
    constructor(baseURL) {
        this.apiClient = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.apiClient.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // Generic method to handle GET requests
    async get(endpoint, params = {}) {
        try {
            const response = await this.apiClient.get(endpoint, { params });
            return response
        } catch (error) {
            throw error 
        }
    }

    // Generic method to handle POST requests
    async post(endpoint, data) {
        try {
            const response = await this.apiClient.post(endpoint, data);
            return response
        } catch (error) {
            throw error
        }
    }

    // Generic method to handle PUT requests
    async put(endpoint, data) {
        try {
            const response = await this.apiClient.put(endpoint, data);
            return response
        } catch (error) {
            throw error
        }
    }

    // Generic method to handle DELETE requests
    async delete(endpoint) {
        try {
            const response = await this.apiClient.delete(endpoint);
            return response
        } catch (error) {
            throw error
        }
    }

}

const api = new APIRequest('http://localhost:8080');

export default api;

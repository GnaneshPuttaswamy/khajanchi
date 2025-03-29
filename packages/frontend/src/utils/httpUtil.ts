import axios from 'axios';

export const AUTH_ERROR_EVENT = 'auth_error';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        const errorCode = data?.error?.code;
        const errorMessage = data?.error?.message || 'Authentication failed';

        if (
          errorCode === 'AUTH_TOKEN_EXPIRED' ||
          errorCode === 'AUTH_TOKEN_INVALID' ||
          errorCode === 'AUTH_USER_NOT_FOUND' ||
          errorCode === 'AUTH_NO_TOKEN' ||
          errorCode === 'AUTH_FAILED'
        ) {
          localStorage.removeItem('authToken');
          window.dispatchEvent(
            new CustomEvent(AUTH_ERROR_EVENT, {
              detail: {
                errorCode,
                errorMessage,
              },
            })
          );
        }
      }
    }

    return Promise.reject(error);
  }
);

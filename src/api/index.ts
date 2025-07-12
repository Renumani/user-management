import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://reqres.in/api/';
export const tokenKey = 'auth_token';
export const API_KEY = 'reqres-free-v1';

// apis of the app
export const LOGIN = "login";
export const USERS = "users";


export const apiGet = <T = any>(url: string, config?: AxiosRequestConfig) => {
  const token = localStorage.getItem(tokenKey);
  return axios.get<T>(`${BASE_URL}${url}`, {
    ...config,
    headers: {
      'x-api-key': API_KEY,
      Authorization: token ? `Bearer ${token}` : '',
      ...(config?.headers || {}),
    },
  });
};

export const apiPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const token = localStorage.getItem(tokenKey);
  const isLoginEndpoint = url === LOGIN;
  console.log('Sending login to:', `${BASE_URL}${LOGIN}`, data);
  return axios.post<T>(`${BASE_URL}${url}`, data, {
    ...config,
    headers: {
      'x-api-key': API_KEY,
      ...(isLoginEndpoint ? {} : { Authorization: token ? `Bearer ${token}` : '' }),
      ...(config?.headers || {}),
    },
  });
};

export const apiPut = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const token = localStorage.getItem(tokenKey);
  return axios.put<T>(`${BASE_URL}${url}`, data, {
    ...config,
    headers: {
      'x-api-key': API_KEY,
      Authorization: token ? `Bearer ${token}` : '',
      ...(config?.headers || {}),
    },
  });
};

export const apiDelete = <T = any>(url: string, config?: AxiosRequestConfig) => {
  const token = localStorage.getItem(tokenKey);
  return axios.delete<T>(`${BASE_URL}${url}`, {
    ...config,
    headers: {
      'x-api-key': API_KEY,
      Authorization: token ? `Bearer ${token}` : '',
      ...(config?.headers || {}),
    },
  });
};
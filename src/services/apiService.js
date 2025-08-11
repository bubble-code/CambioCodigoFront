// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://10.0.0.19:5000';
const API_TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      return Promise.reject({
        message: error.response.data?.message || 'Error en la solicitud',
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject({
        message: 'No se recibió respuesta del servidor',
      });
    } else {
      // Algo pasó al configurar la solicitud
      return Promise.reject({
        message: 'Error al configurar la solicitud',
      });
    }
  }
);

export const CargaService = {
  async getListadoCarga(filtros) {
    try {
      const response = await apiClient.post('/getListadoCarga', {
        idseccion: filtros.idSeccion,
        fechaDesde: filtros.fechaDesde,
        fechaHasta: filtros.fechaHasta,
        filtros: filtros.filtros,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener listado de Cargas');
    }
  },
  async getCentros() {
    try {
      const response = await apiClient.get('/getCentros');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener la lista de centros');
    }
  },
};


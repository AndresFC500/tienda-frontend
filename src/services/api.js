import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const getProductos = async () => {
  const res = await axios.get(`${API_URL}/productos`)
  return res.data
}

export const crearProducto = async (producto) => {
  const res = await axios.post(`${API_URL}/productos`, producto)
  return res.data
}

export const venderProducto = async (id, cantidad) => {
  const res = await axios.post(`${API_URL}/ventas`, { id, cantidad })
  return res.data
}

export const pedirProducto = async (id, cantidad) => {
  const res = await axios.post(`${API_URL}/pedidos`, { id, cantidad })
  return res.data
}

export const getEstadisticas = () => axios.get(`${API_URL}/estadisticas`)

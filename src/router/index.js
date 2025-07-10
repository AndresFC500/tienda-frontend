import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgregarProducto from '../views/AgregarProducto.vue'

// Definición de rutas
const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/agregar', name: 'AgregarProducto', component: AgregarProducto }
]

// Creación del enrutador
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 👇 Exportación por defecto para que funcione en main.js
export default router

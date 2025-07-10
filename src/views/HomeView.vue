<template>
  <div class="container">
    <h1>Tienda</h1>

    <!-- Formulario para agregar producto -->
    <section class="form-section">
      <h2>Agregar Producto</h2>
      <form @submit.prevent="agregarProducto">

        <div class="form-group">
          <label>Nombre del producto</label>
          <input v-model="nuevoProducto.nombre" placeholder="Ej: Cuaderno" required />
          <div v-if="errores.nombre" class="error">{{ errores.nombre }}</div>
        </div>

        <div class="form-group">
          <label>Tipo de producto</label>
          <select v-model="nuevoProducto.tipo" required>
            <option disabled value="">Seleccione tipo</option>
            <option value="papeleria">Papelería</option>
            <option value="supermercado">Supermercado</option>
            <option value="drogueria">Droguería</option>
          </select>
          <div v-if="errores.tipo" class="error">{{ errores.tipo }}</div>
        </div>

        <div class="form-group">
          <label>Cantidad Actual</label>
          <input v-model.number="nuevoProducto.cantidadActual" type="number" placeholder="Ej: 50" required />
          <div v-if="errores.cantidadActual" class="error">{{ errores.cantidadActual }}</div>
        </div>

        <div class="form-group">
          <label>Cantidad Mínima</label>
          <input v-model.number="nuevoProducto.cantidadMinima" type="number" placeholder="Ej: 10" required />
          <div v-if="errores.cantidadMinima" class="error">{{ errores.cantidadMinima }}</div>
        </div>

        <div class="form-group">
          <label>Precio Base</label>
          <input v-model.number="nuevoProducto.precioBase" type="number" placeholder="Ej: 2000" required />
          <div v-if="errores.precioBase" class="error">{{ errores.precioBase }}</div>
        </div>

        <button type="submit" class="btn-verde">Agregar</button>
      </form>
    </section>


    <!-- Lista de productos -->
    <section class="product-list">
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Stock</th>
            <th>Vendidos</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.tipo }}</td>
            <td>{{ producto.cantidadActual }}</td>
            <td>{{ producto.unidadesVendidas }}</td>
            <td>
              <input v-model.number="cantidades[producto.id]" type="number" min="1" placeholder="Cantidad" />
            </td>
            <td>
              <button @click="venderProducto(producto.id)" style="background-color: green; color: white;">Vender</button>
              <button @click="pedirProducto(producto.id)" style="background-color: orange; color: white;">Pedir</button>
              <div v-if="errores[producto.id]" class="error">{{ errores[producto.id] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Estadísticas -->
    <section class="stats">
      <h2>Estadísticas</h2>
      <ul>
        <li>Ingresos Totales: ${{ estadisticas.ingresosTotales }}</li>
        <li>Promedio de Ventas: ${{ estadisticas.promedioVentas }}</li>
        <li>Más Vendido: {{ estadisticas.masVendido }}</li>
        <li>Menos Vendido: {{ estadisticas.menosVendido }}</li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      productos: [],
      estadisticas: {},
      cantidades: {},
      errores: {},
      nuevoProducto: {
        nombre: '',
        tipo: '',
        cantidadActual: 0,
        cantidadMinima: 0,
        precioBase: 0
      }
    }
  },
  methods: {
    cargarDatos() {
      axios.get('http://localhost:8080/api/productos')
        .then(res => this.productos = res.data)

      axios.get('http://localhost:8080/api/estadisticas')
        .then(res => this.estadisticas = res.data)
    },
    agregarProducto() {
      this.errores = {}
      const { nombre, tipo, cantidadActual, cantidadMinima, precioBase } = this.nuevoProducto
      if (!nombre) this.errores.nombre = 'El nombre es obligatorio.'
      if (!tipo) this.errores.tipo = 'Debe seleccionar un tipo.'
      if (cantidadActual <= 0) this.errores.cantidadActual = 'Cantidad actual debe ser mayor que 0.'
      if (cantidadMinima <= 0) this.errores.cantidadMinima = 'Cantidad mínima debe ser mayor que 0.'
      if (precioBase <= 0) this.errores.precioBase = 'Precio base debe ser mayor que 0.'

      if (Object.keys(this.errores).length > 0) return

      axios.post('http://localhost:8080/api/productos', this.nuevoProducto)
        .then(() => {
          this.nuevoProducto = { nombre: '', tipo: '', cantidadActual: 0, cantidadMinima: 0, precioBase: 0 }
          this.cargarDatos()
        })
    },
    venderProducto(id) {
      const cantidad = this.cantidades[id]
      this.errores[id] = ''

      if (!cantidad || cantidad <= 0) {
        this.errores[id] = 'Ingrese una cantidad válida para vender.'
        return
      }

      axios.post('http://localhost:8080/api/ventas', { id, cantidad })
        .then(() => this.cargarDatos())
        .catch(error => {
          if (error.response && error.response.data) {
            alert(error.response.data.message || 'Error al vender producto.')
          } else {
            alert('Error de conexión o del servidor.')
          }
        })
    },
    pedirProducto(id) {
      const cantidad = this.cantidades[id]
      this.errores[id] = ''

      if (!cantidad || cantidad <= 0) {
        this.errores[id] = 'Ingrese una cantidad válida para pedir.'
        return
      }

      axios.post('http://localhost:8080/api/pedidos', { id, cantidad })
        .then(() => this.cargarDatos())
        .catch(error => {
          if (error.response && error.response.data) {
            alert(error.response.data.message || 'Error al pedir producto.')
          } else {
            alert('Error de conexión o del servidor.')
          }
        })
    }
  },
  mounted() {
    this.cargarDatos()
  }
}
</script>


<style>
.container {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}
h1, h2 {
  color: #2c3e50;
}
form {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input, select, button {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
}
button:hover {
  background-color: #2980b9;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
table, th, td {
  border: 1px solid #ddd;
}
th, td {
  padding: 0.5rem;
  text-align: left;
}
.stats ul {
  list-style: none;
  padding: 0;
}
.stats li {
  padding: 0.3rem 0;
}
.error {
  color: red;
  font-size: 0.875rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  font-weight: bold;
  color: #34495e;
}

.error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.btn-verde {
  background-color: #28a745; /* verde tipo Bootstrap */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.btn-verde:hover {
  background-color: #218838;
}
</style>

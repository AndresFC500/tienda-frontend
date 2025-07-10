<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
    <h2 class="text-2xl font-bold text-indigo-600 mb-4">📝 Agregar nuevo producto</h2>

    <form @submit.prevent="guardarProducto" class="space-y-4">
      <div>
        <label class="block font-medium">Nombre</label>
        <input v-model="form.nombre" type="text" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block font-medium">Tipo</label>
        <select v-model="form.tipo" class="w-full border rounded px-3 py-2" required>
          <option disabled value="">Seleccionar tipo</option>
          <option value="papeleria">Papelería</option>
          <option value="supermercado">Supermercado</option>
          <option value="drogueria">Droguería</option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Cantidad Actual</label>
        <input v-model.number="form.cantidadActual" type="number" min="0" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block font-medium">Cantidad Mínima</label>
        <input v-model.number="form.cantidadMinima" type="number" min="1" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block font-medium">Precio Base</label>
        <input v-model.number="form.precioBase" type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" required />
      </div>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Guardar producto
      </button>
    </form>

    <div v-if="mensaje" class="mt-4 text-green-600">
      ✅ {{ mensaje }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { crearProducto } from '../services/api'

const form = ref({
  nombre: '',
  tipo: '',
  cantidadActual: 0,
  cantidadMinima: 1,
  precioBase: 0,
  unidadesVendidas: 0
})

const mensaje = ref('')

const guardarProducto = async () => {
  try {
    await crearProducto(form.value)
    mensaje.value = 'Producto creado correctamente ✅'
    // Reiniciar formulario
    form.value = {
      nombre: '',
      tipo: '',
      cantidadActual: 0,
      cantidadMinima: 1,
      precioBase: 0,
      unidadesVendidas: 0
    }
  } catch (error) {
    console.error(error)
    mensaje.value = '❌ Error al crear el producto'
  }
}
</script>

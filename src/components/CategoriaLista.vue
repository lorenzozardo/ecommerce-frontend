<script setup>
import { ref, onMounted } from 'vue'
import { listarCategorias } from '../services/categoriaService.js'

const categorias = ref([])
const carregando = ref(false)
const erro = ref('')

async function carregar() {
    carregando.value = true
    erro.value = ''
    try {
        categorias.value = await listarCategorias()
    } catch (e) {
        erro.value = 'Não foi possível carregar as categorias.'
    } finally {
        carregando.value = false
    }
}

onMounted(() => { carregar() })
</script>

<template>
    <section class="container">
        <h2>Categorias</h2>
        <p v-if="carregando">Carregando...</p>
        <p v-else-if="erro" class="erro">{{ erro }}</p>
        <ul v-else-if="categorias.length">
            <li v-for="c in categorias" :key="c.id">{{ c.nome }}</li>
        </ul>
        <p v-else>Nenhuma categoria cadastrada.</p>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { listarCategorias } from '../services/categoriaService.js'

const props = defineProps({ filtros: { type: Object, required: true } })
defineEmits(['limpar'])

const categorias = ref([])
onMounted(async () => { categorias.value = await listarCategorias() })
</script>

<template>
    <div class="filtros">
        <div class="filtros-grid">
            <div class="campo">
                <label>Nome</label>
                <input type="search" v-model="props.filtros.nome" placeholder="Ex.: notebook" />
            </div>
            <div class="campo">
                <label>Categoria</label>
                <select v-model="props.filtros.categoriaId">
                    <option :value="null">Todas</option>
                    <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
            </div>
            <div class="campo">
                <label>Preço mínimo</label>
                <input type="number" min="0" step="0.01"
                    v-model.number="props.filtros.precoMin" placeholder="0,00" />
            </div>
            <div class="campo">
                <label>Preço máximo</label>
                <input type="number" min="0" step="0.01"
                    v-model.number="props.filtros.precoMax" placeholder="0,00" />
            </div>
            <div class="campo-checkbox">
                <input type="checkbox" id="disponiveis" v-model="props.filtros.apenasDisponiveis" />
                <label for="disponiveis">Apenas disponíveis</label>
            </div>
        </div>
        <button class="btn-link" @click="$emit('limpar')">Limpar filtros</button>
    </div>
</template>
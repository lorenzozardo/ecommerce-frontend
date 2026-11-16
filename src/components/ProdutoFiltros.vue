<script setup>
import { onMounted, ref } from 'vue'
import { listarCategorias } from '../services/categoriaService.js'

// "filtros" é um objeto reactive do pai (useFiltro): alterar os campos aqui atualiza o pai
const props = defineProps({ filtros: { type: Object, required: true } })
defineEmits(['limpar'])

const categorias = ref([])

onMounted(async () => {
    try {
        categorias.value = await listarCategorias()
    } catch (e) {
        categorias.value = []
    }
})
</script>

<template>
    <div class="filtros">
        <div class="filtros-header">
            <h3>Filtros</h3>
            <button type="button" class="btn-link" @click="$emit('limpar')">Limpar filtros</button>
        </div>
        <div class="filtros-grid">
            <!-- filtros enviados ao backend -->
            <div class="campo">
                <label for="filtro-nome">Nome</label>
                <input id="filtro-nome" type="search" v-model="props.filtros.nome" placeholder="Ex.: notebook" />
            </div>
            <div class="campo">
                <label for="filtro-categoria">Categoria</label>
                <select id="filtro-categoria" v-model="props.filtros.categoriaId">
                    <option :value="null">Todas</option>
                    <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
            </div>

            <!-- filtros locais (aplicados sobre a página atual) -->
            <div class="campo">
                <label for="filtro-preco-min">Preço mínimo</label>
                <input id="filtro-preco-min" type="number" min="0" step="0.01"
                    v-model.number="props.filtros.precoMin" placeholder="0,00" />
            </div>
            <div class="campo">
                <label for="filtro-preco-max">Preço máximo</label>
                <input id="filtro-preco-max" type="number" min="0" step="0.01"
                    v-model.number="props.filtros.precoMax" placeholder="0,00" />
            </div>
            <div class="campo-checkbox">
                <input type="checkbox" id="disponiveis" v-model="props.filtros.apenasDisponiveis" />
                <label for="disponiveis">Apenas disponíveis</label>
            </div>
        </div>
    </div>
</template>

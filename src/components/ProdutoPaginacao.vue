<script setup>
import { computed } from 'vue'

const props = defineProps({
    numero: { type: Number, required: true },
    totalPaginas: { type: Number, required: true },
    totalItens: { type: Number, required: true },
    tamanho: { type: Number, required: true },
    primeira: Boolean,
    ultima: Boolean,
    desabilitado: Boolean,
})
defineEmits(['proxima', 'anterior', 'mudar-tamanho'])

const numeroHumano = computed(() => props.numero + 1)
</script>

<template>
    <nav class="paginacao">
        <span>Página {{ numeroHumano }} de {{ totalPaginas }} ({{ totalItens }} item(ns))</span>
        <select :value="tamanho" @change="$emit('mudar-tamanho', Number($event.target.value))">
            <option v-for="t in [5, 10, 20, 50]" :key="t" :value="t">{{ t }} por página</option>
        </select>
        <button :disabled="primeira || desabilitado" @click="$emit('anterior')">Anterior</button>
        <button :disabled="ultima || desabilitado" @click="$emit('proxima')">Próxima</button>
    </nav>
</template>

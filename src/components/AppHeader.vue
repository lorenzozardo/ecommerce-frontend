<script setup>
defineProps({
    secao: { type: String, default: 'produtos' },
})
defineEmits(['update:secao'])

const secoes = [
    { id: 'produtos', rotulo: 'Produtos' },
    { id: 'categorias', rotulo: 'Categorias' },
]
</script>

<template>
    <header class="app-header">
        <div class="container header-content">
            <div class="marca">
                <strong>E-commerce</strong>
                <span>Frontend em Vue.js</span>
            </div>
            <nav class="menu" aria-label="Seções">
                <button
                    v-for="s in secoes"
                    :key="s.id"
                    type="button"
                    :class="['menu-item', { ativo: secao === s.id }]"
                    :aria-current="secao === s.id ? 'page' : undefined"
                    @click="$emit('update:secao', s.id)"
                >
                    {{ s.rotulo }}
                </button>
            </nav>
        </div>
    </header>
</template>

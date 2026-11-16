<script setup>
import { computed } from 'vue'

const props = defineProps({ produto: { type: Object, required: true } })

const precoFormatado = computed(() => {
    const valor = Number(props.produto.preco)
    if (Number.isNaN(valor)) return 'R$ 0,00'
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
})

// badges de status do estoque
const semEstoque = computed(() => Number(props.produto.estoque) <= 0)
const estoqueBaixo = computed(() => {
    const q = Number(props.produto.estoque)
    return q > 0 && q < 5
})
</script>

<template>
    <article class="produto-card">
        <div>
            <span v-if="produto.nomeCategoria" class="produto-categoria">{{ produto.nomeCategoria }}</span>
            <h3>{{ produto.nome }}</h3>
            <p>{{ produto.descricao || 'Produto sem descrição cadastrada.' }}</p>
        </div>
        <footer>
            <strong>{{ precoFormatado }}</strong>
            <div class="produto-estoque">
                <span>Estoque: {{ produto.estoque }}</span>
                <span v-if="semEstoque" class="badge badge-danger">Sem estoque</span>
                <span v-else-if="estoqueBaixo" class="badge badge-warning">Estoque baixo</span>
            </div>
        </footer>
    </article>
</template>

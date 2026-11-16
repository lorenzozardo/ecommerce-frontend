<script setup>
import { onMounted } from 'vue'
import { listarCategorias } from '../services/categoriaService.js'
import { useListagem } from '../composables/useListagem.js'
import PainelLista from './PainelLista.vue'

// estado de carregamento, erro e lista vazia vêm do composable useListagem
const { itens: categorias, carregando, erro, vazio, total, carregar } = useListagem(listarCategorias)

function quantidadeDeProdutos(categoria) {
    const quantidade = categoria.produtos?.length ?? 0
    return quantidade === 1 ? '1 produto' : `${quantidade} produtos`
}

onMounted(() => { carregar() })
</script>

<template>
    <PainelLista titulo="Categorias cadastradas" :total="total"
        :carregando="carregando" :erro="erro" :vazio="vazio"
        mensagem-vazio="Nenhuma categoria cadastrada."
        @atualizar="carregar()">
        <ul class="categoria-lista">
            <li v-for="c in categorias" :key="c.id" class="categoria-item">
                <span class="categoria-nome">{{ c.nome }}</span>
                <span class="categoria-contagem">{{ quantidadeDeProdutos(c) }}</span>
            </li>
        </ul>
    </PainelLista>
</template>

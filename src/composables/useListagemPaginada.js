import { ref, reactive } from 'vue'

export function useListagemPaginada(buscador) {
    const itens = ref([])
    const carregando = ref(false)
    const erro = ref('')
    const pagina = reactive({
        numero: 0,
        tamanho: 10,
        totalPaginas: 0,
        totalItens: 0,
        primeira: true,
        ultima: true,
    })

    const total = ref(0)
    const vazio = ref(false)

    async function carregar() {
        carregando.value = true
        erro.value = ''
        try {
            const dados = await buscador({ page: pagina.numero, size: pagina.tamanho })
            itens.value = dados.content
            pagina.totalPaginas = dados.totalPages
            pagina.totalItens = dados.totalElements
            pagina.primeira = dados.first
            pagina.ultima = dados.last
            total.value = dados.totalElements
            vazio.value = dados.content.length === 0
        } catch (e) {
            erro.value = 'Não foi possível carregar os dados.'
            itens.value = []
        } finally {
            carregando.value = false
        }
    }

    function irParaPagina(n) { pagina.numero = n; carregar() }
    function proxima() { if (!pagina.ultima) irParaPagina(pagina.numero + 1) }
    function anterior() { if (!pagina.primeira) irParaPagina(pagina.numero - 1) }
    function mudarTamanho(novoTamanho) { pagina.tamanho = novoTamanho; pagina.numero = 0; carregar() }
    function reiniciar() { pagina.numero = 0; carregar() }

    return { itens, carregando, erro, vazio, total, pagina, carregar, reiniciar, proxima, anterior, mudarTamanho }
}
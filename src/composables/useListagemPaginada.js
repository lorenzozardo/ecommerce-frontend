import { ref, reactive } from 'vue'

// O buscador recebe { page, size } e deve retornar um objeto Page do Spring
// (content, totalElements, totalPages, first, last). A paginação do Spring começa em 0.
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

    // Se uma busca antiga terminar depois de uma mais nova (ex.: digitação rápida no filtro),
    // a resposta antiga é descartada para não sobrescrever o resultado atual.
    let ultimaRequisicao = 0

    async function carregar() {
        const requisicao = ++ultimaRequisicao
        carregando.value = true
        erro.value = ''
        try {
            const dados = await buscador({ page: pagina.numero, size: pagina.tamanho })
            if (requisicao !== ultimaRequisicao) return
            itens.value = dados.content
            pagina.totalPaginas = dados.totalPages
            pagina.totalItens = dados.totalElements
            pagina.primeira = dados.first
            pagina.ultima = dados.last
            total.value = dados.totalElements
            vazio.value = dados.content.length === 0
        } catch (e) {
            if (requisicao !== ultimaRequisicao) return
            erro.value = 'Não foi possível carregar os dados. Verifique se o backend está no ar.'
            itens.value = []
            total.value = 0
        } finally {
            if (requisicao === ultimaRequisicao) carregando.value = false
        }
    }

    function irParaPagina(n) { pagina.numero = n; carregar() }
    function proxima() { if (!pagina.ultima) irParaPagina(pagina.numero + 1) }
    function anterior() { if (!pagina.primeira) irParaPagina(pagina.numero - 1) }
    function mudarTamanho(novoTamanho) { pagina.tamanho = novoTamanho; pagina.numero = 0; carregar() }
    function reiniciar() { pagina.numero = 0; carregar() }

    return { itens, carregando, erro, vazio, total, pagina, carregar, reiniciar, proxima, anterior, mudarTamanho }
}

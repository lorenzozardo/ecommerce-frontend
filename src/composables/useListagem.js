import { ref, computed } from 'vue'

export function useListagem(carregadorPadrao) {
    const itens = ref([])
    const carregando = ref(false)
    const erro = ref('')
    const vazio = computed(() => !carregando.value && !erro.value && itens.value.length === 0)
    const total = computed(() => itens.value.length)

    async function carregar(carregador = carregadorPadrao) {
        carregando.value = true
        erro.value = ''
        try {
            const dados = await carregador()
            itens.value = Array.isArray(dados) ? dados : []
        } catch (e) {
            erro.value = 'Não foi possível carregar os dados. Verifique se o backend está no ar.'
            itens.value = []
        } finally {
            carregando.value = false
        }
    }

    return { itens, carregando, erro, vazio, total, carregar }
}

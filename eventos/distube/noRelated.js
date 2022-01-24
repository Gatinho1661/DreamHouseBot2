// Emitido quando nenhuma música relacionada for encontrada
module.exports = {
    nome: "noRelated",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(filaMusicas) {
        console.debug(`Nenhuma música relacionada foi encontrada em: ${filaMusicas.voiceChannel?.name}`)
    }
}
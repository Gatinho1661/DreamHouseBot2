// Emitido quando o bot é desconectado de um canal de voz
module.exports = {
    nome: "disconnect",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(filaMusicas) {
        console.debug(`Bot desconectado de: ${filaMusicas.voiceChannel?.name}`)
    }
}
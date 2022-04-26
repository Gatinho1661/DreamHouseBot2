// Emitido quando uma fila de música é crianda
module.exports = {
    nome: "initQueue",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    async executar(filaMusicas) {
        filaMusicas.autoplay = true;
        filaMusicas.volume = 100;

        client.log("musica", `Fila de música iniciada em: ${filaMusicas.voiceChannel?.name}`);
    }
}
// Emitido quando uma fila de música é deletada
module.exports = {
  nome: "deleteQueue",
  once: false, // Se deve ser executado apenas uma vez
  origem: client.distube,

  async executar(filaMusicas) {
    client.log("musica", `Fila de música deletada em: ${filaMusicas.voiceChannel?.name}`);
  }
};
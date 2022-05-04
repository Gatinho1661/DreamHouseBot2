// Emitido quando nenhuma música relacionada for encontrada
module.exports = {
  nome: "noRelated",
  once: false, // Se deve ser executado apenas uma vez
  origem: client.distube,

  async executar(filaMusicas) {
    client.log(
      "musica", `Nenhuma música relacionada foi encontrada em: ${filaMusicas.voiceChannel?.name}`
    );
  }
};
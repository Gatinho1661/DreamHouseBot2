// Emitido quando uma fila de música é finalizada
module.exports = {
  nome: "error",
  once: false, // Se deve ser executado apenas uma vez
  origem: client.distube,

  async executar(canal, error) {
    client.log("erro", `${error.name} - DisTube: ${error.message.replaceAll("\n", " ")}`);
  }
};
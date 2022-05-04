const { MessageEmbed } = require("discord.js");

module.exports = {
  //* Infomações do comando
  emoji: "🔀",
  nome: "aleatorizar",
  sinonimos: [],
  descricao: "Aleatória as músicas da fila",
  exemplos: [
    { comando: "aleatorizar", texto: "Aleatória as músicas da fila atual" },
  ],
  args: "",
  opcoes: [],
  canalVoz: true,
  contaPrimaria: false,
  apenasServidor: true,
  apenasDono: false,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES"]
  },
  cooldown: 1,
  escondido: false,
  suporteBarra: true,
  testando: false,

  //* Comando
  async executar(iCmd) {
    // Pegar fila de músicas do servidor
    const filaMusicas = client.distube.getQueue(iCmd.guild);

    // Caso não tenha
    if (!filaMusicas) {
      return client.responder(
        iCmd,
        "bloqueado",
        "Está bem quieto aqui...",
        "Nenhuma música está sendo tocada nesse servidor"
      );
    }

    // Aleatorizar as músicas da fila
    await filaMusicas.shuffle();
    client.log("musica", `Fila aleatorizada em: ${filaMusicas.voiceChannel?.name}`);

    const Embed = new MessageEmbed()
      .setColor(client.defs.corEmbed.normal)
      .setTitle(`${this.emoji} Músicas aleatorizadas`)
      .setDescription("As músicas da fila foram aleatorizadas");
    await iCmd.reply({ content: null, embeds: [Embed] }).catch();
  }
};
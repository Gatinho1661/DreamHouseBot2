const { formatarCanal } = require("../../modulos/utils");

module.exports = {
  //* Infomações do comando
  emoji: "😂",
  nome: "meme",
  sinonimos: [],
  descricao: "Envia um meme salvo",
  exemplos: [
    { comando: "meme [nome]", texto: "Envia um meme salvo" },
  ],
  args: "",
  opcoes: [
    {
      name: "nome",
      description: "O nome do meme para enviar",
      type: client.defs.tiposOpcoes.STRING,
      required: true,
      autocomplete: true
    }
  ],
  canalVoz: false,
  contaPrimaria: false,
  apenasServidor: false,
  apenasDono: false,
  nsfw: false,
  permissoes: {
    usuario: [],
    bot: ["SEND_MESSAGES"]
  },
  cooldown: 1,
  escondido: false,
  suporteBarra: true,

  //* Comando
  async executar(iCmd, opcoes) {
    //* Pegar meme
    const meme = client.memes.get(opcoes.nome);

    if (meme) {
      await iCmd.reply({ content: opcoes.usuario ? `${opcoes.usuario}\n${meme.meme}` : `${meme.meme}` });
      client.log(
        "meme", `${iCmd.commandName} enviada em #${formatarCanal(iCmd.channel)} por @${iCmd.user.tag}`
      );
    } else {
      client.responder(iCmd, "bloqueado", "Meme não encontrado", "Não encontrei o meme que você pediu");
    }
  },

  //* Autocompletar
  autocompletar(iteracao, pesquisa) {

    //* Pegar lista de memes
    const memes = client.memes.indexes;

    const filtrado = memes.filter(meme => meme.startsWith(pesquisa.value.toLowerCase()));
    const resultados = filtrado.map(resultado => ({ name: resultado, value: resultado }));

    return resultados;
  }
};
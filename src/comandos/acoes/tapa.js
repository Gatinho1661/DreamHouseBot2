const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  //* Infomações do comando
  emoji: "🖐️",
  nome: "tapa",
  sinonimos: [],
  descricao: "De um tapa em uma pessoa",
  exemplos: [
    { comando: "tapa [pessoa]", texto: "Dar um tapa em uma pessoa" },
  ],
  args: "",
  opcoes: [
    {
      name: "pessoa",
      description: "Pessoa para dar um tapa",
      type: client.defs.tiposOpcoes.USER,
      required: true
    },
  ],
  canalVoz: false,
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
  async executar(iCmd, opcoes) {
    const euMesmo = opcoes.pessoa.membro.id === client.user.id;

    // Se o usuario tentar me dar um tapa ele vai tomar um tapa meu
    const usuario1 = euMesmo ? iCmd.guild.me : iCmd.member;
    const usuario2 = euMesmo ? iCmd.member : opcoes.pessoa.membro;

    const pingApi = new Date();
    const { url } = await fetch("https://nekos.life/api/v2/img/slap")
      .then(resultado => resultado.json());

    client.log("api", `Nekos: ${new Date().getTime() - pingApi.getTime()}ms ${url}`);

    const Embed = new MessageEmbed()
      .setColor(usuario2.displayColor ? usuario2.displayHexColor : client.defs.corEmbed.normal)
      .setDescription(`🖐️ **${usuario1.toString()} deu um tapa em ${usuario2.toString()}!**`)
      .setImage(url);
    iCmd.reply({ content: null, embeds: [Embed] }).catch();
  }
};
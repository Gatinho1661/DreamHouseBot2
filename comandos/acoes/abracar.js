const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    //* Infomações do comando
    emoji: "💙",
    nome: "abracar",
    sinonimos: [],
    descricao: "Abrace uma pessoa",
    exemplos: [
        { comando: "abracar [pessoa]", texto: "Abraçar uma pessoa" },
    ],
    args: "",
    opcoes: [
        {
            name: "pessoa",
            description: "Pessoa para abraçar",
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
    testando: true,

    //* Comando
    async executar(iCmd, opcoes) {
        const siMesmo = opcoes.pessoa.membro.id === iCmd.member.id;

        // Se o usuario tentar se abraçar o bot irar abraçar o usuario
        const usuario1 = siMesmo ? iCmd.guild.me : iCmd.member;
        const usuario2 = siMesmo ? iCmd.member : opcoes.pessoa.membro

        const pingApi = new Date();
        const { url } = await fetch("https://nekos.life/api/v2/img/hug").then(resultado => resultado.json());
        client.log("api", `Nekos: ${new Date().getTime() - pingApi.getTime()}ms ${url}`);

        const Embed = new MessageEmbed()
            .setColor(usuario2.displayColor ? usuario2.displayHexColor : client.defs.corEmbed.normal)
            .setDescription(`💙 **${usuario1.toString()} abraçou ${usuario2.toString()}!**`)
            .setImage(url)
        iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}
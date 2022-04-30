const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    //* Infomações do comando
    emoji: "❤️",
    nome: "beijar",
    sinonimos: [],
    descricao: "Beije uma pessoa",
    exemplos: [
        { comando: "acariciar [pessoa]", texto: "Beijar uma pessoa" },
    ],
    args: "",
    opcoes: [
        {
            name: "pessoa",
            description: "Pessoa para beijar",
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
        if (opcoes.pessoa.membro.id === iCmd.member.id || opcoes.pessoa.membro.id === client.user.id) {
            return client.responder(iCmd, "bloqueado", "Ta carente?", "Sinto muito");
        }

        const usuario1 = iCmd.member;
        const usuario2 = opcoes.pessoa.membro

        const pingApi = new Date();
        const { url } = await fetch("https://nekos.life/api/v2/img/kiss").then(resultado => resultado.json());
        client.log("api", `Nekos: ${new Date().getTime() - pingApi.getTime()}ms ${url}`);

        const Embed = new MessageEmbed()
            .setColor(usuario2.displayColor ? usuario2.displayHexColor : client.defs.corEmbed.normal)
            .setDescription(`❤️ **${usuario1.toString()} beijou ${usuario2.toString()}!**`)
            .setImage(url)
        iCmd.reply({ content: null, embeds: [Embed] }).catch();
    }
}
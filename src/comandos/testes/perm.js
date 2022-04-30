const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "📛",
    nome: "perm",
    sinonimos: [],
    descricao: "Testa o sistema de perms",
    exemplos: [],
    args: "",
    opcoes: [],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: ["ADMINISTRATOR", "BAN_MEMBERS"],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,
    suporteBarra: true,

    //* Comando
    async executar(iCmd) {
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`📛 Perm`)
            .setDescription("comando executado");
        await iCmd.reply({ content: null, embeds: [Embed] }).catch();
    },
}
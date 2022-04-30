const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🏓",
    nome: "ping",
    sinonimos: [],
    descricao: "Mostra a latência do bot com o discord",
    exemplos: [],
    args: "",
    opcoes: [],
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
    async executar(iCmd) {
        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`🏓 Ping`)
            .setDescription("calculando ping...");
        const pingado = await iCmd.reply({ content: null, embeds: [pingando], fetchReply: true }).catch();

        const ping = pingado.createdAt.getTime() - iCmd.createdAt.getTime();
        const api = Math.round(client.ws.ping);

        client.log("verbose", `Latência: ${ping}ms`);
        client.log("verbose", `API: ${api}ms`);

        const resposta = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`🏓 Pong`)
            .addFields(
                { name: 'Latência', value: `${ping}ms`, inline: true },
                { name: 'API', value: `${api}ms`, inline: true },
            );
        await iCmd.editReply({ content: null, embeds: [resposta] }).catch();
    },

    //* Comando como mensagem
    async executarMsg(msg) {
        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`🏓 Ping`)
            .setDescription("calculando ping...");
        const pingado = await msg.channel.send({ content: null, embeds: [pingando], reply: { messageReference: msg } }).catch();

        const ping = pingado.createdAt.getTime() - msg.createdAt.getTime();
        const api = Math.round(client.ws.ping);

        client.log("verbose", `Latência: ${ping}ms`);
        client.log("verbose", `API: ${api}ms`);

        const resposta = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`🏓 Pong`)
            .addFields(
                { name: 'Latência', value: `${ping}ms`, inline: true },
                { name: 'API', value: `${api}ms`, inline: true },
            );
        await pingado.edit({ content: null, embeds: [resposta] }).catch();
    }
}
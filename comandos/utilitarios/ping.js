const { MessageEmbed } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🏓",
    nome: "ping",
    sinonimos: ["pong", "api", "latencia"],
    descricao: "Mostra a latência",
    exemplos: ["!ping"],
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

    //* Comando
    async executar(msg) {
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
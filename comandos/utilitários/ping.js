const { MessageEmbed } = require("discord.js");
const { Command } = require('discord.js-commando');


module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            memberName: "ping",
            aliases: ["pong", "api", "latencia"],
            group: "utilitários",
            args: [],
            //argsType: "string",
            //argsCount: "0",
            description: "Mostra a latência.",
            examples: ["!ping"],
            guildOnly: false,
            ownerOnly: false,
            userPermissions: [],
            clientPermissions: ["SEND_MESSAGES"],
            nsfw: false,
            hidden: false,
            throttling: {
                usages: 1,
                duration: 1,
            }
        });
    }

    async run(msg, args) {
        const excTempo = new Date
        const client = this.client

        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`🏓 Ping`)
            .setDescription("calculando ping...");
        const pingado = await msg.channel.send({ content: null, embeds: [pingando], reply: { messageReference: msg } }).catch();
        client.emit("respondido", excTempo, this, msg, args);

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

        client.emit("executado", excTempo, this, msg, args);
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
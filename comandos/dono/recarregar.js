const { MessageButton, MessageEmbed, DiscordAPIError } = require("discord.js");
const { Command, CommandGroup } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "recarregar",
            memberName: "recarregar",
            aliases: ["r", "reload"],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Recarrega comandos.",
            examples: ["!teste"],
            guildOnly: false,
            ownerOnly: true,
            userPermissions: [],
            clientPermissions: [],
            nsfw: false,
            hidden: true,
            throttling: {
                usages: 1,
                duration: 1,
            },
            guarded: true // * impede que esse comando seja desativado 
        });
    }

    async run(msg, args) {
        const excTempo = new Date
        const client = this.client

        if (!args[0]) {
            const semArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription(`Qual comando ou grupo você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [semArgs], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
            return;
        }

        const comando = client.registry.findCommands(args[0], false)[0];
        const grupo = client.registry.findGroups(args[0], false)[0];

        if (comando instanceof Command) {
            comando.reload()

            const embedCmd = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comando recarregado`)
                .setDescription(`\`${comando.name}\` foi recarregado`);
            await msg.channel.send({ content: null, embeds: [embedCmd], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
        } else if (grupo instanceof CommandGroup) {
            grupo.reload()

            const embedGrp = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos recarregados`)
                .setDescription(`Todos os comandos de \`${grupo.name}\` foram recarregados`);
            await msg.channel.send({ content: null, embeds: [embedGrp], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
        } else {
            const falhaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle('❌ Comando ou grupo não encontrado')
                .setDescription(`${args[0]} não foi encontrado`)
            await msg.channel.send({ content: null, embeds: [falhaEmbed], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
        }

        client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
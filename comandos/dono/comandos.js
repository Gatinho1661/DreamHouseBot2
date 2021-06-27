const { MessageEmbed } = require("discord.js");
const { Command } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "comandos",
            memberName: "comandos",
            aliases: [],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Atualiza ou remove todos os comandos /",
            examples: ["!comandos"],
            guildOnly: false,
            ownerOnly: true,
            userPermissions: [],
            clientPermissions: [],
            nsfw: false,
            hidden: true,
            throttling: {
                usages: 1,
                duration: 1,
            }
        });
    }

    async run(msg, args) {
        const excTempo = new Date

        if (!args[0]) {
            const argsEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando argumentos`)
                .setDescription(`Qual comando ou grupo você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [argsEmbed], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
            return;
        }

        if (args[0] === "deletar") {
            await client.application?.commands.set([])

            const semArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos deletados`)
                .setDescription(`Todos os comandos / foram deletados globalmente`);
            await msg.channel.send({ content: null, embeds: [semArgs], reply: { messageReference: msg } }).catch();

            client.emit("respondido", excTempo, this, msg, args)
            client.console("bot", "Todos os comandos / foram deletados globalmente")
        } else if (args[0] === "atualizar") {
            const server = "353942726389137428"

            const memesNomes = client.memes.indexes
            console.debug(memesNomes)

            let memes = []

            for (let i = 0; i < memesNomes.length; i++) {
                const meme = client.memes.get(memesNomes[i]);

                memes.push({
                    name: memesNomes[i],
                    description: `Meme criado por ${meme.usuario}`
                })
            }

            await client.application?.commands.set(memes, server);

            const atualizado = new MessageEmbed()
                .setColor(client.defs.corEmbed.sim)
                .setTitle(`✅ Comandos atualizados`)
                .setDescription(`Todos os comandos / foram atualizados globalmente`);
            await msg.channel.send({ content: null, embeds: [atualizado], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args)
            client.console("bot", "Todos os comandos / foram atualizados globalmente")

            console.debug(await client.application.commands.cache.map(cmd => cmd))
        } else {
            const erradoArgs = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Faltando errados`)
                .setDescription(`Qual comando ou grupo você quer recarregar ?`);
            await msg.channel.send({ content: null, embeds: [erradoArgs], reply: { messageReference: msg } }).catch();
            client.emit("respondido", excTempo, this, msg, args);
            return;
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
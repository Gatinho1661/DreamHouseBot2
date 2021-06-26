const { MessageEmbed, } = require("discord.js");
const { Command } = require('discord.js-commando');
const parece = require("string-similarity");


module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "desconhecido",
            memberName: "desconhecido",
            aliases: [],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Comando que é executado quando nenhum outro comando é encontrado",
            examples: ["!ping"],
            guildOnly: false,
            ownerOnly: true,
            userPermissions: [],
            clientPermissions: ["SEND_MESSAGES"],
            nsfw: false,
            hidden: true,
            throttling: {
                usages: 1,
                duration: 1,
            },
            unknown: true // ! Comando que é executado quando nenhum outro comando é encontrado
        });
    }

    async run(msg) { //args
        const client = this.client

        const comandos = []
        client.registry.commands.each(cmd => {
            if (cmd.hidden) return;
            if (cmd.ownerOnly) return;
            comandos.push(cmd.name)
            comandos.concat(cmd.aliases)
        })

        // procurar por comandos similar
        const nomeComando = msg.content.slice(client.commandPrefix.length).trim().split(/ +/).shift().toLowerCase()
        const similar = parece.findBestMatch(nomeComando, comandos)

        if (similar.bestMatch.rating >= 0.3) {
            client.log("info", `Comando sugerido ${similar.bestMatch.target}`)

            const resposta = new MessageEmbed()
                .setColor(client.defs.corEmbed.aviso)
                .setTitle(`❓ Comando não encontrado`)
                .setDescription(`você quis dizer: \`${similar.bestMatch.target}\`?`)
            msg.channel.send({ content: null, embeds: [resposta], reply: { messageReference: msg } }).catch();
        } else {
            client.log("info", `Nenhum comando foi encontrado com o nome ${nomeComando}`)
        }
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
const { MessageButton, MessageEmbed } = require("discord.js");
const { Command } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "teste",
            memberName: "teste",
            aliases: ["test", "t"],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Testa coisas.",
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
            }
        });
    }

    async run(msg, args) {
        const excTempo = new Date

        const canal = client.config.get("nao-existe")
        console.debug(canal)

        //client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
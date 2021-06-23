const { MessageButton, MessageEmbed, DiscordAPIError } = require("discord.js");
const { Command } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "teste",
            memberName: "teste",
            aliases: ["test", "t"],
            group: "dono",
            args: [],
            //argsType: "string",
            //argsCount: "0",
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
        const client = this.client

        const menuEmbed = new MessageEmbed()
            .setColor(client.config.corEmbed.normal)
            .setTitle(`Cargos disponíveis`)
            .setDescription("🔫│**CS Composto**\n🐔│**Stardew frogs**\n🦾│**Cyberpunk frogs**\n🔝│**Top frogs**\n🏝️│**Perdidos frogs**\n🌳│**Minecraft frogs**\n👁️│**bbb frogs**\n⛱️│**soltos frogs**\n🚗│**Mario frogs**\n🦸│**Marvel frogs**\n🎲│**Tabletop frogs**\n🐲│**Perdidos no RP**")
            .setFooter("Escolha um emote do cargo que deseja ter");

        const cargosEmojis = ["🔫", "🐔", "🦾", "🔝", "🏝️", "🌳", "👁️", "⛱️", "🚗", "🦸", "🎲", "🐲"]

        var botoesArray = []
        for (let i = 0; i < cargosEmojis.length; i++) {
            botoesArray.push(new MessageButton().setEmoji(cargosEmojis[i]).setStyle('SECONDARY').setCustomID(`${i}`))
        }

        const chunk = 5;
        var botoes = []
        for (let i = 0, tamanho = botoesArray.length; i < tamanho; i += chunk) {
            botoes.push(botoesArray.slice(i, i + chunk));
        }

        await msg.channel.send({
            content: null,
            embeds: [menuEmbed],
            components: botoes,
            //reply: { messageReference: msg }
        }).catch();
        client.emit("respondido", excTempo, this, msg, args)

        client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
//const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
//const { Command } = require('discord.js-commando');
//const chrono = require('chrono-node');
//const cron = require('node-cron');
//const fetch = require("node-fetch");

module.exports = {
    emoji: "",
    nome: "emular",
    sinonimos: ["e"],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",

    // Necessário
    canalVoz: false,        // está em um canal de voz
    contaPrimaria: false,   // ser uma conta primaria
    apenasServidor: false,  // está em um servidor
    apenasDono: true,       // ser o dono
    nsfw: false,            // ser um canal NSFW

    permissoes: {
        usuario: [],        // permissões do usuário
        bot: []             // permissões do bot
    },
    cooldown: 1,            // número em segundos de cooldown

    escondido: true,        // comando fica escondido do comando de ajuda

    suporteBarra: false,
    testando: true,

    async executar(msg, args) {
        switch (args[0]) {
            case "entrar": {
                const membro = msg.mentions.members.first();

                client.emit("guildMemberAdd", membro);
                break;
            }
            case "sair": {
                const membro = msg.mentions.members.first();

                client.emit("guildMemberRemove", membro);
                break;
            }

            default: break;
        }
    }
}
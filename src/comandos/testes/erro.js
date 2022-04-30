const { MessageEmbed } = require("discord.js");
//const { Command } = require('discord.js-commando');
//const chrono = require('chrono-node');
//const cron = require('node-cron');
//const fetch = require("node-fetch");

module.exports = {
    emoji: "",
    nome: "erro",
    sinonimos: [],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",
    opcoes: [],

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

    suporteBarra: true,
    testando: true,

    async executar(iCmd) {
        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`Vai dar erro`)
            .setDescription("olha o erro vindo");
        await iCmd.reply({ content: null, embeds: [pingando] }).catch();

        throw new Error("ERRO DE TESTES");
    }
}
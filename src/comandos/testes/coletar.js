const { MessageEmbed } = require("discord.js");
//const { Command } = require('discord.js-commando');
//const chrono = require('chrono-node');
//const cron = require('node-cron');
//const fetch = require("node-fetch");

module.exports = {
    emoji: "",
    nome: "coletar",
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

    async executar(iCmd) {
        const pingando = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`COLETANDO`)
            .setDescription("colentando mensagens...");
        const mensagem = await iCmd.reply({ content: null, embeds: [pingando], fetchReply: true }).catch();

        const coletor = mensagem.channel.createMessageCollector({ time: 60000 });
        //const filtro = (msg) => msg

        coletor.on("collect", men => {
            console.log(men.reference);

            console.debug(mensagem.id);
            console.debug(men.reference?.messageId);

            if (mensagem.id === men.reference?.messageId) {
                console.debug("mensagem respondida")
                console.debug(men.content)
            } else {
                console.debug("mensagem não respondida")
            }
        })

        coletor.once('end', (coletado, razao) => {
            client.log("info", `Coletor terminado por ${razao}, coletando ${coletado.size} interações id:${mensagem.id}`);
        });
    }
}
const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🚫",
    nome: "nfs",
    sinonimos: ["nofapseptember", "nofapsep"],
    descricao: "Funcionalidades do evento NFS",
    exemplos: [
        { comando: "nfs iniciar", texto: "Inicia o evento" },
        { comando: "nfs parar", texto: "Para o evento e apaga todos os dados salvos" },
        { comando: "nfs limpar", texto: "Apaga todos os dados salvos" },
        { comando: "nfs grafico", texto: "Mostra o grafico do evento" },
        { comando: "nfs check", texto: "Envia o check do dia" },
        { comando: "nfs resultados", texto: "Envia o check do dia" },
        { comando: "nfs regras", texto: "Envia o check do dia" },
    ],
    args: "[evento]",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: true,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES", "MANAGE_ROLES"]
    },
    cooldown: 1,

    //* Comando
    async executar(msg, args) {
        switch (args[0]) {
            case "iniciar": {
                const cargo = msg.mentions.roles.first();
                if (!cargo) {
                    client.responder(msg, this, "uso", "Sem cargo", "Você precisa mencionar um cargo para iniciar esse evento");
                    break
                }

                const regras = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`🚫 Regras`)
                    .setDescription(
                        "• Não pode se masturbar\n"
                        + "• É permitido fazer sexo (EZ mode)\n"
                        + "• Websexo e Sexting não conta, você ainda perde\n"
                    )
                    .addField("E o mais importante", "Não se sinta pressionado em continuar\nninguém vai te julgar");
                const check = new MessageEmbed()
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`✅ Check`)
                    .setDescription(
                        "Todo dia, **meia noite** será enviado o **check** do dia,\nque você tera que marcar seu resultado\n\nvocê pode marcar a qualquer momento,\nnão precisa ter pressa"
                    );
                await msg.channel.send({ content: "> **No Fap September**", embeds: [regras, check] }).catch();

                const participar = new MessageButton()
                    .setEmoji()
                    .setCustomId("participarNFS")
                    .setLabel("Participar")
                    .setStyle("PRIMARY");
                const participantes = new MessageEmbed()
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`👥 Participantes`)
                    .setDescription(`Ao participar você recebe o cargo: <@&${cargo.id}>`)
                    .setFooter("clique no botão para participar");
                const participantesMsg = await msg.channel.send({
                    content: null,
                    embeds: [participantes],
                    components: [{ type: 'ACTION_ROW', components: [participar] }]
                }).catch();

                break
            }
            default: {
                break
            }
        }
    }
};

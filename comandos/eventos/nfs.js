const { MessageEmbed, MessageButton } = require("discord.js");
const nfs = require("./../../modulos/nfs");

module.exports = {
    //* Infomações do comando
    emoji: "🚫",
    nome: "nfs",
    sinonimos: ["nofapseptember", "nofapsep"],
    descricao: "Funcionalidades do evento NFS",
    exemplos: [
        { comando: "nfs iniciar [cargo]", texto: "Inicia o evento" },
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
                        "Todo dia, **meia noite** será enviado o **check** do dia,\n"
                        + "que você tera que marcar seu resultado\n\n"
                        + "Você pode marcar a qualquer momento\n"
                        + "mas não pode mudar o resultado depois"
                    );
                await msg.channel.send({ content: "> **No Fap September**", embeds: [regras, check] }).catch();

                const participar = new MessageButton()
                    .setEmoji()
                    .setCustomId("nfs=participar")
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

                nfs.iniciar(msg, participantesMsg, cargo);
                break
            }
            case "check": {
                const dia = new Date();
                const numero = Number(args[1]);
                if (numero && numero > 0 && numero < 31) dia.setDate(numero);

                const passou = new MessageButton()
                    //.setEmoji("✅")
                    .setCustomId(`nfs=passou=${dia.getDate()}`)
                    .setLabel("Passei")
                    .setStyle("SUCCESS");
                const perdeu = new MessageButton()
                    //.setEmoji("❌")
                    .setCustomId(`nfs=perdeu=${dia.getDate()}`)
                    .setLabel("Perdi")
                    .setStyle("DANGER");
                const check = new MessageEmbed()
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`☑️ Check diário (Dia ${dia.getDate()})`)
                    .setDescription(
                        "Você pode marcar a qualquer momento\n"
                        + "mas não pode mudar o resultado depois"
                    )
                    .addField("Ganhadores", "• Ninguém", true)
                    .addField("Perdedores", "• Ninguém", true)

                    .setFooter(`Marque seu resultado`);
                const checkMsg = await msg.channel.send({
                    content: null,
                    embeds: [check],
                    components: [{ type: 'ACTION_ROW', components: [passou, perdeu] }]
                }).catch();

                nfs.check(checkMsg, dia);
                break
            }
            default: {
                break
            }
        }
    }
};

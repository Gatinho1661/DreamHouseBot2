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

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`❓ Substituir mensagem de cargos`)
            .setDescription("já existe uma mensagem de cargos, deseja substituir por uma nova?")
            .setFooter("escolha clicando nos botões");

        const sim = new MessageButton()
            .setCustomID(`sim`)
            .setLabel('Sim')
            //.setEmoji("✅")
            .setDisabled(false)
            .setStyle("SUCCESS");

        const nao = new MessageButton()
            .setCustomID('nao')
            .setLabel('Não')
            //.setEmoji("❌")
            .setDisabled(false)
            .setStyle("DANGER");

        const resposta = await msg.channel.send({
            content: null,
            embeds: [Embed],
            components: [[
                sim,
                nao
            ]],
            reply: { messageReference: msg }
        }).catch();
        client.emit("respondido", excTempo, this, msg, args);

        const filtro = (interaction) => interaction.user.id === msg.author.id;
        resposta.awaitMessageComponentInteraction(filtro, { time: 60000 })
            .then(i => {
                switch (i.customID) {

                    case "sim":
                        i.update({
                            content: resposta.content || null,
                            embeds: [Embed.setColor(client.defs.corEmbed.sim)],
                            components: [[
                                sim.setLabel("Enviada").setDisabled(true),
                            ]]
                        }).catch();

                        client.emit("executado", excTempo, this, msg, args)
                        break;

                    case "nao":
                        i.update({
                            content: resposta.content || null,
                            embeds: [Embed.setColor(client.defs.corEmbed.nao)],
                            components: [[
                                nao.setLabel("Cancelado").setDisabled(true),
                            ]]
                        }).catch();

                        client.emit("executado", excTempo, this, msg, args)
                        break;

                    default:
                        client.log("erro", `Um botão chamado "${i.customID}" foi precionado, mais nenhuma ação foi definida`)
                        break;
                }
                client.log("verbose", `@${i.user.tag} apertou "${i.customID}" id:${msg.id}`)
            }).catch(err => {

                client.log("erro", err.stack)
                client.log("comando", `Ocorreu um erro em ${this.name} ao ser executado por @${msg.author.tag}`, "erro");

                const erro = new MessageButton()
                    .setCustomID(`erro`)
                    .setLabel('Ocorreu um erro')
                    .setDisabled(true)
                    .setStyle('DANGER');

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: [[
                        erro
                    ]]
                }).catch();

                client.emit("executado", excTempo, this, msg, args)
            })

        /*
        const coletor = resposta.createMessageComponentInteractionCollector(i => i, { time: 300000, idle: 60000 })
        client.log("info", `Coletor de botões iniciado em #${canal} por @${msg.author.tag} id:${msg.id}`)

        //* Blacklist para responder uma pessoa apenas uma vez
        const blacklist = []
        coletor.on("collect", i => {
            try {
                if (blacklist.includes(i.user.id)) return client.log("verbose", `@${i.user.tag} apartou: ${i.customID}, mas foi ignorado id:${msg.id}`);

                //* Se Não foi o dono da msg reponder apenas um vez e depois ignorar
                if (i.user.id !== msg.author.id) {
                    blacklist.push(i.user.id),
                        client.log("verbose", `@${i.user.tag} apartou: ${i.customID}, mas foi bloqueado id:${msg.id}`);

                    const cuidaEmbed = new MessageEmbed()
                        .setColor(client.defs.corEmbed.nao)
                        .setTitle(`⛔ Cuida da sua vida`)
                        .setDescription("essa mensagem não foi direcionada a você");
                    return i.reply({
                        content: null,
                        embeds: [cuidaEmbed],
                        ephemeral: true
                    })
                }

                switch (i.customID) {

                    case "sim":

                        coletor.stop("Botão precionado");
                        break;

                    case "nao":

                        coletor.stop("Botão precionado");
                        break;

                    default:
                        client.log("erro", `Um botão chamado "${i.customID}" foi precionado, mais nenhuma ação foi definida`)
                        break;
                }
                client.log("verbose", `@${i.user.tag} apertou "${i.customID}" id:${msg.id}`)
            } catch (err) {
                client.log("erro", err.stack)
                client.log("comando", `Ocorreu um erro em ${this.name} ao ser executado por @${msg.author.tag}`, "erro");

                const erro = new MessageButton()
                    .setCustomID(`erro`)
                    .setLabel('Ocorreu um erro')
                    .setDisabled(true)
                    .setStyle('DANGER');

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: [[
                        erro
                    ]]
                }).catch();

                client.emit("executado", excTempo, this, msg, args)
            }
        })

        coletor.once('end', (coletado, razao) => {
            client.log("info", `Coletor de botões terminado por ${razao} em #${canal}, coletando ${coletado.size} interações id:${msg.id}`)
            resposta.edit({
                content: resposta.content || null,
                embeds: resposta.embeds,
                components: [[
                    sim.setDisabled(true),
                    nao.setDisabled(true)
                ]]
            }).catch();

            client.emit("executado", excTempo, this, msg, args)
        });*/

        //client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};
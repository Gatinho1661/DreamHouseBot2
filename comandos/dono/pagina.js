const { MessageButton, MessageEmbed, DiscordAPIError } = require("discord.js");
const { Command } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "pagina",
            memberName: "pagina",
            aliases: ["pag"],
            group: "dono",
            argsType: "multiple",
            argsCount: 0,
            description: "Testa paginas.",
            examples: ["!paginas"],
            guildOnly: false,
            ownerOnly: false,
            userPermissions: [],
            clientPermissions: ["SEND_MESSAGES"],
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
        const canal = /store|news|text/i.test(msg.channel.type) ? (msg.channel.name.includes("│") ? msg.channel.name.split("│")[1] : msg.channel.name) : "DM"

        const menuEmbed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`Menu`)
            .setDescription("esse é o menu")
            .setFooter("Veja mais infomações, clicando nos botões");

        var embedsarray = [menuEmbed]
        for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
            embedsarray.push(new MessageEmbed().setColor("RAMDOM").setTitle(i + 1 + "").setDescription("outra pagina").setFooter("Veja mais infomações, clicando nos botões"))
        }

        var pagina = 0;

        const voltar = new MessageButton()
            .setCustomID(`voltar`)
            .setLabel('<<')
            .setDisabled(false)
            .setStyle('SECONDARY');

        const menu = new MessageButton()
            .setCustomID('menu')
            .setLabel('O')
            .setDisabled(false)
            .setStyle("PRIMARY")

        const progredir = new MessageButton()
            .setCustomID('progredir')
            .setLabel('>>')
            .setDisabled(false)
            .setStyle("SECONDARY");

        const resposta = await msg.channel.send({
            content: null,
            embeds: [menuEmbed],
            components: [[voltar.setDisabled(true),
            menu.setDisabled(true),
                progredir
            ]],
            reply: { messageReference: msg }
        }).catch();
        client.emit("respondido", excTempo, this, msg, args);

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
                    case "voltar":
                        if (pagina === 0) {
                            client.log("aviso", `(${msg.id}) Mensagem com paginas dessincronizadas`);
                            break;
                        }

                        --pagina
                        i.update({
                            content: resposta.content || null,
                            embeds: [embedsarray[pagina]],
                            components: [[
                                voltar.setDisabled(pagina <= 0),
                                menu.setDisabled(pagina <= 0),
                                progredir.setDisabled(embedsarray.length - 1 <= pagina)
                            ]]
                        }).catch();
                        break;

                    case "menu":
                        if (pagina === 0) {
                            client.log("aviso", `(${msg.id}) Mensagem com paginas dessincronizadas`);
                            break;
                        }

                        pagina = 0
                        i.update({
                            content: resposta.content || null,
                            embeds: [embedsarray[pagina]],
                            components: [[
                                voltar.setDisabled(pagina <= 0),
                                menu.setDisabled(pagina <= 0),
                                progredir.setDisabled(embedsarray.length - 1 <= pagina)
                            ]]
                        }).catch();
                        break;

                    case "progredir":
                        if (embedsarray.length - 1 <= pagina) {
                            client.log("aviso", `(${msg.id}) Mensagem com paginas dessincronizadas`);
                            break;
                        }

                        ++pagina
                        i.update({
                            content: resposta.content || null,
                            embeds: [embedsarray[pagina]],
                            components: [[
                                voltar.setDisabled(pagina <= 0),
                                menu.setDisabled(pagina <= 0),
                                progredir.setDisabled(embedsarray.length - 1 <= pagina)
                            ]]
                        }).catch();
                        break;

                    default:
                        client.log("erro", `Um botão chamado "${i.customID}" foi precionado, mais nenhuma ação foi definida`)
                        break;
                }
                client.log("verbose", `@${i.user.tag} apertou "${i.customID}" pagina: ${pagina}/${embedsarray.length - 1} id:${msg.id}`)
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
                    voltar.setDisabled(true),
                    menu.setDisabled(true),
                    progredir.setDisabled(true),
                ]]
            }).catch();

            client.emit("executado", excTempo, this, msg, args)
        });
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};

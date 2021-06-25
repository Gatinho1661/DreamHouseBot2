const { MessageButton, MessageEmbed, Emoji, Role } = require("discord.js");
const { Command } = require('discord.js-commando');
//const erros = require("../../modulos/erros");

module.exports = class Comando extends Command {
    constructor(client) {
        super(client, {
            name: "cargos",
            memberName: "cargos",
            aliases: ["c"],
            group: "administração",
            argsType: "multiple",
            argsCount: 4,
            description: "Gerencia os cargos autoaplicáveis.",
            examples: ["\`cargo\`", "\`cargo adicionar\`", "\`cargo remover\`", "\`cargo a\`", "\`cargo r\`"],
            guildOnly: false,
            ownerOnly: false,
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["SEND_MESSAGES"],
            nsfw: false,
            hidden: false,
            throttling: {
                usages: 1,
                duration: 3,
            }
        });
    }

    async run(msg, args) {
        const excTempo = new Date
        const client = this.client

        //* caso não tenha nenhum args
        if (!args[0]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Você quer adicionar ou remover um cargo?");

        //* adicionar um cargo
        if (/^a(?:d(?:icionar|d))?$/i.test(args[0])) {

            //* Verificar se está mencionando um cargo
            if (!/<@&(\d{17,19})>/.test(args[1])) return client.responder(msg, this, "uso", "⛔ Argumentos errados", "O segundo argumento deve ser um cargo");

            //* Achar mensagem
            const msgCargos = client.config.get("msgCargos");

            const servidor = await client.guilds.fetch(msgCargos.servidor);
            if (!servidor) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const canal = await servidor.channels.fetch(msgCargos.canal);
            if (!canal) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const mensagem = await canal.messages.fetch(msgCargos.id);
            if (!mensagem) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            //* Verificar se cabe na mensagem outro cargo
            const contar = a => a.reduce((p, c) => p.concat(Array.isArray(c) ? flat(c) : c), []);
            console.debug(contar(mensagem.components).length);
            if (contar(mensagem.components).length === 25) return client.responder(msg, this, "bloqueado", "🚫 Limite de cargos", "Não consigo mais adicionar cargo nessa mensagem");

            //* Pegar o cargo enviado
            const cargo = await servidor.roles.fetch(args[1].replace(/<@&|>/g, ""));
            if (!cargo) return client.responder(msg, this, "bloqueado", "🚫 Cargo não existe", `Não encontrei esse cargo, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Pegar emoji do cargo, caso tenha
            //? Devo adicionar emoji-regex ou emojis-list para ser mais preciso?
            console.debug(cargo.name.match(/\p{Emoji_Presentation}/u))
            const emoji = cargo.name.match(/\p{Emoji_Presentation}/u);
            if (!emoji) return client.responder(msg, this, "bloqueado", "🚫 Cargo sem emoji", `Não encontrei emojis nesse cargo, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Salvar cargo
            client.config.push("autoCargos", {
                emoji: emoji[0],
                id: cargo.id,
                nome: cargo.name
            })

            //* Pegar todos os outros cargos
            const autoCargos = client.config.get("autoCargos");

            //* Criar botões e lista de cargos
            const botoesArray = []
            const cargos = []
            for (let i = 0; i < autoCargos.length; i++) {
                const cargo = autoCargos[i];

                botoesArray.push(
                    new MessageButton()
                        .setCustomID(`cargo=${cargo.id}`)
                        .setEmoji(cargo.emoji)
                        .setStyle("SECONDARY")
                )
                cargos.push(`<@&${cargo.id}>`)
            }

            //* Separar botoes em grupos de 5
            const chunk = 5;
            const botoes = []
            for (let i = 0, tamanho = botoesArray.length; i < tamanho; i += chunk) {
                botoes.push(botoesArray.slice(i, i + chunk));
            }

            //* Atualizar embed
            const embed = mensagem.embeds[0]
                .setColor(client.defs.corEmbed.normal)
                .setDescription(cargos.join("\n"))


            //* Atualizar mensagem
            mensagem.edit({
                content: mensagem.content || null,
                embeds: [embed],
                components: botoes,
            }).catch();



            //* remover um cargo
        } else if (/^r(?:em(?:over)?)?$/i.test(args[0])) {
            //TODO FAZER O COISA PARA REMOVER CARGO

            //* criar ou editar uma mensagem de cargos
        } else if (/m(?:ensagem|sg)$/i.test(args[0])) {

            if (!client.config.has("msgCargos")) {

                //TODO COISA AQUI

            } else {
                const msgCargoEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`Cargos disponíveis`)
                    .setDescription(`nenhum`)
                    .setFooter("Adicione um cargo aqui com !cargos adicionar");
                const msgCargo = await msg.channel.send({ content: null, embeds: [msgCargoEmbed] }).catch();
                client.emit("respondido", excTempo, this, msg, args);

                client.config.set("msgCargos", {
                    id: msgCargo.id,
                    canal: msg.channel.id,
                    servidor: msg.guild.id
                })
            }

        } else {

        }

        client.emit("executado", excTempo, this, msg, args)
    }

    onError() {
        // evita enviar a msg padrão de erro
    }

    onBlock() {
        // evita enviar a msg padrão de block
    }
};














































/**
*! lugar fedido
*! NAO PASSE


            //* Regex para verificar se é um emoji (sim é desse tamanho mesmo...)
            const emoteCheck = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/iu
            if (!emoteCheck.test(args[1])) {
                const argsEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Argumentos errados`)
                    .setDescription(`O segundo argumento deve ser um emote/emoji`);
                await msg.channel.send({ content: null, embeds: [argsEmbed], reply: { messageReference: msg } }).catch();
                client.emit("respondido", excTempo, this, msg, args);
                return;
            }

            //* Verificar se está mencionando um cargo
            if (!/<@&(\d{17,19})>/.test(args[2])) {
                const argsEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Argumentos errados`)
                    .setDescription(`O terceiro argumento deve ser um cargo`);
                await msg.channel.send({ content: null, embeds: [argsEmbed], reply: { messageReference: msg } }).catch();
                client.emit("respondido", excTempo, this, msg, args);
                return;
            }

            //* Achar mensagem
            const msgCargos = client.config.get("msgCargos");
            const servidor = await client.guilds.fetch(msgCargos.servidor);
            const canal = await servidor.channels.fetch(msgCargos.canal);
            const mensagem = await canal.messages.fetch(msgCargos.id);
            ////console.debug(mensagens)
            //TODO verificar se existe mensagem

            //* Achar cargo
            const cargo = await servidor.roles.fetch(args[2].replace(/<@&|>/g, ""));
            //TODO verificar se existe cargo

            const autoCargos = client.config.get("autoCargos");

            const cargos = []
            for (let i = 0; i < autoCargos.length; i++) {
                await servidor.roles.fetch(args[2].replace(/<@&|>/g, ""));

                cargos.push(`<@&${autoCargos[i].id}>`);
            }
            cargos.push(`<@&${cargo.id}>`)

            client.config.push("autoCargos", {
                emoji: args[1],
                id: cargo.id,
                nome: cargo.name
            })

            console.debug(cargos)
            const embed = mensagem.embeds[0].setDescription(cargos.join("\n")).setColor(client.defs.corEmbed.normal)
            console.debug(embed)
            mensagem.edit({ content: mensagem.content || null, embeds: [embed] }).catch();


*/
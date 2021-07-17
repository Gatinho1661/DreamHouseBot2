const { MessageButton, MessageEmbed } = require("discord.js");

//! Isso aqui ta nojento
module.exports = {
    //* Infomações do comando
    emoji: "📋",
    nome: "cargos",
    sinonimos: ["c"],
    descricao: "Gerencia os cargos autoaplicáveis",
    exemplos: [
        { comando: "cargo mensagem", texto: "Envia o que será a mensagem de cargos autoaplicáveis" },
        { comando: "cargo adicionar [cargo]", texto: "Adiciona um cargo na lista de cargos autoaplicáveis" },
        { comando: "cargo remover [cargo]", texto: "Remove um cargo na lista de cargos autoaplicáveis" }
    ],
    args: "",
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: ["MANAGE_ROLES"],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,

    //* Comando
    async executar(msg, args) {

        //* caso não tenha nenhum args
        if (!args[0]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Você quer adicionar ou remover um cargo?");

        //* adicionar um cargo
        if (/^a(?:d(?:icionar|d))?$/i.test(args[0])) {

            //* Verificar se está mencionando um cargo
            if (!/<@&(\d{17,19})>/.test(args[1])) return client.responder(msg, this, "uso", "⛔ Argumentos errados", "O segundo argumento deve ser um cargo");
            const cargoId = args[1].replace(/<@&|>/g, "");

            //* Verificar se tem esse cargo na lista
            if (client.config.get("autoCargos").some(cargo => cargo.id === cargoId)) return client.responder(msg, this, "bloqueado", "🚫 Cargo já adicionado", `Esse cargo já está adicionado na lista, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Achar mensagem
            const msgCargos = client.config.get("msgCargos");

            const servidor = await client.guilds.fetch(msgCargos.servidor);
            if (!servidor) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const canal = await servidor.channels.fetch(msgCargos.canal);
            if (!canal) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const mensagem = await canal.messages.fetch(msgCargos.id);
            if (!mensagem) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");


            //* Pegar componentes da mensagem
            let componentes = []
            mensagem.components.forEach(linhas => {
                componentes = componentes.concat(linhas.components)
            });

            //* Verificar se cabe na mensagem outro cargo
            if (componentes.length === 25) return client.responder(msg, this, "bloqueado", "🚫 Limite de cargos", "Não consigo mais adicionar cargo nessa mensagem");

            //* Pegar o cargo enviado
            const cargo = await servidor.roles.fetch(cargoId);
            if (!cargo) return client.responder(msg, this, "bloqueado", "🚫 Cargo não existe", `Não encontrei esse cargo, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Pegar emoji do cargo, caso tenha
            //? Devo adicionar emoji-regex ou emojis-list para ser mais preciso?
            const emoji = cargo.name.match(/\p{Emoji_Presentation}/u);
            if (!emoji) return client.responder(msg, this, "bloqueado", "🚫 Cargo sem emoji", `Não encontrei emojis nesse cargo, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Salvar cargo
            client.config.push("autoCargos", {
                emoji: emoji[0],
                id: cargo.id.toString(),
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
                        .setCustomId(`cargo=${cargo.id.toString()}`)
                        .setEmoji(cargo.emoji)
                        .setStyle("SECONDARY")
                )
                cargos.push(`<@&${cargo.id.toString()}>`)
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
                .setFooter("Escolha um emote do cargo que deseja ter");


            //* Atualizar mensagem
            mensagem.edit({
                content: mensagem.content || null,
                embeds: [embed],
                components: botoes,
            }).catch();


            //* remover um cargo
        } else if (/^r(?:em(?:over)?)?$/i.test(args[0])) {

            //* Verificar se está mencionando um cargo
            if (!/<@&(\d{17,19})>/.test(args[1])) return client.responder(msg, this, "uso", "⛔ Argumentos errados", "O segundo argumento deve ser um cargo");
            const cargoId = args[1].replace(/<@&|>/g, "");

            //* Verificar se tem esse cargo na lista
            if (!client.config.get("autoCargos").some(cargo => cargo.id === cargoId)) return client.responder(msg, this, "bloqueado", "🚫 Cargo não adicionado", `Não encontrei esse cargo na lista, se você acha que isso é um erro fale com <@${client.owners[0].id}>`);

            //* Achar mensagem
            const msgCargos = client.config.get("msgCargos");

            const servidor = await client.guilds.fetch(msgCargos.servidor);
            if (!servidor) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const canal = await servidor.channels.fetch(msgCargos.canal);
            if (!canal) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");

            const mensagem = await canal.messages.fetch(msgCargos.id);
            if (!mensagem) return client.responder(msg, this, "erro", "❗ Ocorreu um erro", "Não conseguir encontrar a mensagem");


            //* Apagar cargo
            client.config.remove("autoCargos", (cargo) => cargo.id === cargoId)

            //* Pegar todos os outros cargos
            const autoCargos = client.config.get("autoCargos");

            //* Recriar botões e lista de cargos
            const botoesArray = []
            const cargos = []
            for (let i = 0; i < autoCargos.length; i++) {
                const cargo = autoCargos[i];

                botoesArray.push(
                    new MessageButton()
                        .setCustomId(`cargo=${cargo.id.toString()}`)
                        .setEmoji(cargo.emoji)
                        .setStyle("SECONDARY")
                )
                cargos.push(`<@&${cargo.id.toString()}>`)
            }

            //* Separar botoes em grupos de 5
            const chunk = 5;
            const botoes = []
            for (let i = 0, tamanho = botoesArray.length; i < tamanho; i += chunk) {
                botoes.push(botoesArray.slice(i, i + chunk));
            }

            //* Atualizar embed
            const embed = mensagem.embeds[0]
                .setColor(cargos.length === 0 ? client.defs.corEmbed.nao : client.defs.corEmbed.normal)
                .setDescription(cargos.join("\n") || "Nenhum")
                .setFooter(cargos.length === 0 ? `Adicione um cargo aqui com ${client.commandPrefix}cargos adicionar` : "Escolha um emote do cargo que deseja ter");


            //* Atualizar mensagem
            mensagem.edit({
                content: mensagem.content || null,
                embeds: [embed],
                components: botoes,
            }).catch();

            //* criar ou editar uma mensagem de cargos
        } else if (/m(?:ensagem|sg)$/i.test(args[0])) {

            //* Já tem msg de cargos
            if (client.config.has("msgCargos")) {

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.carregando)
                    .setTitle(`❓ Substituir mensagem de cargos`)
                    .setDescription("já existe uma mensagem de cargos, deseja substituir por uma nova?")
                    .setFooter("escolha clicando nos botões");

                const sim = new MessageButton()
                    .setCustomId(`sim`)
                    .setLabel('Sim')
                    //.setEmoji("✅")
                    .setDisabled(false)
                    .setStyle("SUCCESS");

                const nao = new MessageButton()
                    .setCustomId('nao')
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

                //* Inicia coletor de botões
                const filtro = (interaction) => interaction.user.id === msg.author.id;
                resposta.awaitMessageComponent({ filtro, time: 60000 })
                    .then(async i => {
                        switch (i.customId) {

                            case "sim": {
                                i.update({
                                    content: resposta.content || null,
                                    embeds: [Embed.setColor(client.defs.corEmbed.sim)],
                                    components: [[
                                        sim.setLabel("Enviada").setDisabled(true),
                                    ]]
                                }).catch();


                                //* Pegar todos os cargos
                                const autoCargos = client.config.get("autoCargos");

                                //* Criar botões e lista de cargos
                                const botoesArray = []
                                const cargos = []
                                for (let i = 0; i < autoCargos.length; i++) {
                                    const cargo = autoCargos[i];

                                    botoesArray.push(
                                        new MessageButton()
                                            .setCustomId(`cargo=${cargo.id}`)
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

                                //* Criar embed
                                const embed = new MessageEmbed()
                                    .setColor(cargos.length === 0 ? client.defs.corEmbed.nao : client.defs.corEmbed.normal)
                                    .setTitle(`Cargos disponíveis`)
                                    .setDescription(cargos.join("\n") || "Nenhum")
                                    .setFooter(cargos.length === 0 ? `Adicione um cargo aqui com ${client.commandPrefix}cargos adicionar` : "Escolha um emote do cargo que deseja ter");

                                //* Enviar mensagem
                                const msgCargo = await msg.channel.send({
                                    content: null,
                                    embeds: [embed],
                                    components: botoes,
                                }).catch();

                                //* Salvar Mensagem de cargos
                                client.config.set("msgCargos", {
                                    id: msgCargo.id,
                                    canal: msg.channel.id,
                                    servidor: msg.guild.id
                                })
                                break;
                            }
                            case "nao": {
                                i.update({
                                    content: resposta.content || null,
                                    embeds: [Embed.setColor(client.defs.corEmbed.nao)],
                                    components: [[
                                        nao.setLabel("Cancelado").setDisabled(true),
                                    ]]
                                }).catch();
                                break;
                            }
                            default: {
                                client.log("erro", `Um botão chamado "${i.customId}" foi precionado, mais nenhuma ação foi definida`)
                                break;
                            }
                        }
                        client.log("verbose", `@${i.user.tag} apertou "${i.customId}" id:${msg.id}`)
                    }).catch(err => {

                        client.log("erro", err.stack)
                        client.log("comando", `Ocorreu um erro em ${this.name} ao ser executado por @${msg.author.tag}`, "erro");

                        const erro = new MessageButton()
                            .setCustomId(`erro`)
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
                    })


                //* Não tem msg de cargos
            } else {

                //* Pegar todos os cargos
                const autoCargos = client.config.get("autoCargos");

                //* Criar botões e lista de cargos
                const botoesArray = []
                const cargos = []
                for (let i = 0; i < autoCargos.length; i++) {
                    const cargo = autoCargos[i];

                    botoesArray.push(
                        new MessageButton()
                            .setCustomId(`cargo=${cargo.id}`)
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

                //* Criar embed
                const embed = new MessageEmbed()
                    .setColor(cargos.length === 0 ? client.defs.corEmbed.nao : client.defs.corEmbed.normal)
                    .setTitle(`Cargos disponíveis`)
                    .setDescription(cargos.join("\n") || "Nenhum")
                    .setFooter(cargos.length === 0 ? `Adicione um cargo aqui com ${client.commandPrefix}cargos adicionar` : "Escolha um emote do cargo que deseja ter");

                //* Enviar mensagem
                const msgCargo = await msg.channel.send({
                    content: null,
                    embeds: [embed],
                    components: botoes,
                }).catch();

                //* Salvar Mensagem de cargos
                client.config.set("msgCargos", {
                    id: msgCargo.id,
                    canal: msg.channel.id,
                    servidor: msg.guild.id
                })
            }

        } else {
            client.responder(msg, this, "uso", "⛔ Argumentos errados", "Você quer adicionar ou remover um cargo?");
        }
    }
};

const { MessageButton, MessageEmbed } = require("discord.js");
const { formatarCanal } = require("../../modulos/utils")
const chrono = require('chrono-node');
//const cron = require('node-cron');

module.exports = {
    //* Infomações do comando
    nome: "aniversario",
    sinonimos: ["aniversário"],
    descricao: "Edite sua data de aniversário e sua idade",
    exemplos: ["!aniversario"],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: false,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,

    //* Comando
    async executar(msg, args) {

        //* caso não tenha nenhum args
        if (!args[0]) return client.responder(msg, this, "uso", "⛔ Faltando argumentos", "Você tem que enviar sua data de nascimento ou de aniversário");

        //* define os dados do usuario da pessoa caso nao tenha
        client.usuarios.ensure(`${msg.author.id}`, {
            textinho: null,
            aniversario: null,
            idade: null,
            orientacao: null,
            pronome: null,
            nome: msg.author.username,
            id: msg.author.id
        });

        //* Pegar dados do usuário
        const usuario = client.usuarios.get(msg.author.id);
        const aniversario = new Date(usuario.aniversario)

        //* Transformar texto em data
        let data = chrono.pt.strict.parseDate(args[0])
        if (!data) return client.responder(msg, this, "uso", "⛔ Argumentos errados", "Você tem que enviar sua data de nascimento");
        data.setHours(0, 0, 0);

        //* Calcular idade
        const idade = new Date().getFullYear() - data.getFullYear();
        if (idade < 1) return client.responder(msg, this, "uso", "⛔ Argumentos errados", `Você tem que enviar sua data de nascimento, se você não quer dizer sua idade fale com <!@${client.dono[0]}>`);

        if (aniversario.getTime() === data.getTime()) return client.responder(msg, this, "uso", "⛔ Argumentos errados", `Sua data de nascimento já está definido para esse dia`);

        const sim = new MessageButton()
            .setCustomId(`sim`)
            .setLabel(`Sim`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);

        const editar = new MessageButton()
            .setCustomId("editar")
            .setLabel("Editar")
            .setDisabled(false)
            .setStyle("PRIMARY");

        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("DANGER");

        const adicionando = usuario.aniversario === null
        let botoes = adicionando ? [[sim, cancelar]] : [[editar, cancelar]];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(adicionando ? '❓ Adicionar aniversário' : '❓ Editar aniversário')
            .setFooter("escolha clicando nos botões");
        adicionando
            ? Embed.addFields([
                { name: "Você nasceu em", value: `<t:${data.getTime() / 1000}:d> <t:${data.getTime() / 1000}:R>`, inline: false },
            ])
            : Embed.addFields([
                { name: "Você nasceu em", value: `<t:${aniversario.getTime() / 1000}:d> <t:${aniversario.getTime() / 1000}:R>`, inline: false },
                { name: "Você deseja editar para", value: `<t:${data.getTime() / 1000}:d> <t:${data.getTime() / 1000}:R>`, inline: false },
            ])
        const resposta = await msg.channel.send({
            content: null,
            embeds: [Embed],
            components: botoes,
            reply: { messageReference: msg }
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            sim(i) {
                client.usuarios.set(msg.author.id, `${data.getFullYear()} ${data.getMonth() + 1} ${data.getDate()} 00:00:00`, 'aniversario');
                client.usuarios.set(msg.author.id, idade, 'idade');
                client.log("info", `Aniversário de ${msg.author.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("✅ Adicionar aniversário")
                    .setFooter("");
                botoes = [[sim.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });
            },
            editar(i) {
                client.usuarios.set(msg.author.id, `${data.getFullYear()} ${data.getMonth() + 1} ${data.getDate()} 00:00:00`, 'aniversario');
                client.usuarios.set(msg.author.id, idade, 'idade');
                client.log("info", `Aniversário de ${msg.author.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("✅ Editar aniversário")
                    .setFooter("");
                botoes = [[editar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });
            },
            cancelar(i) {
                client.log("info", `Cancelado`);

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle("❌ Cancelado")
                    .setFooter("");
                botoes = [[cancelar.setDisabled(true)]];

                i.update({
                    content: resposta.content || null,
                    embeds: [Embed],
                    components: botoes
                });
            }
        }

        //* Coletor de interações
        const coletor = resposta.createMessageComponentCollector({ time: 60000 })
        client.log("info", `Coletor de botões iniciado em #${formatarCanal(msg.channel)} por @${msg.author.tag} id:${msg.id}`);

        //* Quando algum botão for apertado
        coletor.on("collect", i => {
            if (i.user.id !== msg.author.id) {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}", mas foi bloqueado id:${msg.id}`);

                const cuidaEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Cuida da sua vida`)
                    .setDescription("essa mensagem não foi direcionada a você");
                return i.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
            }

            try {
                client.log("verbose", `@${i.user.tag} apertou "${i.customId}" id:${msg.id}`)
                respostas[i.customId](i);
            } catch (err) {
                client.log("erro", err.stack)
                client.log("comando", `Ocorreu um erro em ${this.nome} ao ser executado por @${msg.author.tag}`, "erro");

                coletor.stop("erro")
            } finally {
                coletor.stop("respondido");
            }
        })

        //* Quando o coletor termina
        coletor.once('end', (coletado, razao) => {
            client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(msg.channel)}, coletando ${coletado.size} interações id:${msg.id}`);

            if (razao === "erro") {
                const erro = new MessageButton()
                    .setCustomId(`erro`)
                    .setLabel('Ocorreu um erro')
                    .setDisabled(true)
                    .setStyle('DANGER');
                botoes = [[erro]]

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
            if (razao === "time") {
                const tempo = new MessageButton()
                    .setCustomId(`tempo`)
                    .setLabel("Tempo esgotado")
                    .setDisabled(true)
                    .setStyle('SECONDARY');
                botoes = [[tempo]];

                resposta.edit({
                    content: resposta.content || null,
                    embeds: resposta.embeds,
                    components: botoes
                }).catch();
            }
        });
    }
};
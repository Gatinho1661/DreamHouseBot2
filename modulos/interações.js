const { MessageButton, MessageEmbed } = require("discord.js");
const { formatarCanal } = require("../modulos/utils")

exports.aceitas = function (cmd, msg, resposta, respostas, filtro) {
    const coletor = resposta.createMessageComponentCollector({ time: 60000 })
    client.log("info", `Coletor de botões iniciado em #${formatarCanal(msg.channel)} por @${msg.author.tag} id:${msg.id}`);

    coletor.on("collect", i => {
        if (filtro(i)) {
            client.log("verbose", `@${i.user.tag} apertou "${i.customId}", mas foi bloqueado id:${msg.id}`);

            const cuidaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.cancelar)
                .setTitle(`⛔ Cuida da sua vida`)
                .setDescription("essa mensagem não foi direcionada a você");
            return i.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
        }

        try {
            client.log("verbose", `@${i.user.tag} apertou "${i.customId}" id:${msg.id}`)
            const parar = respostas[i.customId](i);
            if (parar) coletor.stop("respondido");
        } catch (err) {
            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${cmd.nome} ao ser executado por @${msg.author.tag}`, "erro");

            coletor.stop("erro")
        }
    })

    coletor.once('end', (coletado, razao) => {
        client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(msg.channel)}, coletando ${coletado.size} interações id:${msg.id}`);

        const botao = new MessageButton()

        if (razao === "erro") {
            botao
                .setCustomId(`erro`)
                .setLabel('Ocorreu um erro')
                .setDisabled(true)
                .setStyle('DANGER');

            resposta.edit({
                content: resposta.content || null,
                embeds: resposta.embeds,
                components: [{ type: 'ACTION_ROW', components: [botao] }],
            }).catch();
        }
        if (razao === "time") {
            botao
                .setCustomId(`tempo`)
                .setLabel("Tempo esgotado")
                .setDisabled(true)
                .setStyle('SECONDARY');

            resposta.edit({
                content: resposta.content || null,
                embeds: resposta.embeds,
                components: [{ type: 'ACTION_ROW', components: [botao] }],
            }).catch();
        }
    });
}


exports.pagina = function (cmd, msg, resposta, respostas, filtro) {

    const coletor = resposta.createMessageComponentCollector({ time: 180000, idle: 60000 })
    client.log("info", `Coletor de botões iniciado em #${formatarCanal(msg.channel)} por @${msg.author.tag} id:${msg.id}`)

    coletor.on("collect", i => {
        try {
            if (filtro(i)) {
                const cuidaEmbed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`⛔ Cuida da sua vida`)
                    .setDescription("essa mensagem não foi direcionada a você");
                return i.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
            }

            const { parar, paginaAtual, paginaTotal } = respostas[i.customId](i);
            client.log("verbose", `@${i.user.tag} apertou "${i.customId}" pagina: ${paginaAtual}/${paginaTotal} id:${msg.id}`)
            if (parar) coletor.stop("fechado");
        } catch (err) {
            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${cmd.nome} ao ser executado por @${msg.author.tag}`, "erro");

            coletor.stop("erro")
        }
    })

    coletor.once('end', (coletado, razao) => {
        client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(msg.channel)}, coletando ${coletado.size} interações id:${msg.id}`);

        const botao = new MessageButton()

        if (razao === "erro") {
            botao
                .setCustomId(`erro`)
                .setLabel('Ocorreu um erro')
                .setDisabled(true)
                .setStyle('DANGER');
        }
        if (razao === "time") {
            botao
                .setCustomId(`tempo`)
                .setLabel("Tempo esgotado")
                .setDisabled(true)
                .setStyle('SECONDARY');
        }
        if (razao === "idle") {
            botao
                .setCustomId(`tempo`)
                .setLabel("Inatividade")
                .setDisabled(true)
                .setStyle('SECONDARY');
        }
        if (razao === "fechado") {
            botao
                .setCustomId(`fechado`)
                .setLabel("Fechado")
                .setDisabled(true)
                .setStyle('SECONDARY');
        }

        resposta.edit({
            content: resposta.content || null,
            embeds: resposta.embeds,
            components: [{ type: 'ACTION_ROW', components: [botao] }],
        }).catch();
    });
}
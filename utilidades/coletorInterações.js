const { MessageButton, MessageEmbed } = require("discord.js");
const { formatarCanal } = require("../modulos/utils")

module.exports = (iCmd, resposta, executar, filtro) => {
    const coletor = resposta.createMessageComponentCollector({ time: 180000, idle: 60000 })
    client.log("info", `Coletor de interações de componente iniciado em #${formatarCanal(iCmd.channel)} por @${iCmd.user.tag} msgId:${resposta.id}`)
    let selecionado = null;
    let selecionadoTipo = null

    coletor.on("collect", async iCMsg => {
        if (filtro(iCMsg)) {
            const cuidaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Cuida da sua vida`)
                .setDescription("Essa mensagem não foi direcionada a você");
            return iCMsg.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
        }

        try {
            const resultado = await executar[iCMsg.customId](iCMsg);
            selecionado = iCMsg.componentType === "SELECT_MENU" ? iCMsg.values : iCMsg.customId;
            selecionadoTipo = iCMsg.componentType;

            if (resultado) coletor.stop("finalizado");
        } catch (err) {
            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${iCmd.commandName} ao ser executado por @${iCmd.user.tag}`, "erro");

            coletor.stop("erro")
        }
    })

    coletor.once('end', (coletado, razao) => {
        client.log("info", `Coletor de interações de componente ${razao} em #${formatarCanal(iCmd.channel)}, coletando ${coletado.size} interações msgId:${resposta.id}`);
        if (razao === "finalizado") {
            for (const actionRows of resposta.components) {
                for (const componente of actionRows.components) {
                    if (componente.style === "LINK") continue; // se for um botao de link ignore

                    componente.setDisabled(true); // desativa o componente

                    //trocar o estilo de todos menos o botao selecionado
                    if (componente.customId !== selecionado) componente.setStyle?.("SECONDARY");

                    //mostra os intens selecionados
                    if (componente.type === "SELECT_MENU" && selecionadoTipo === "SELECT_MENU") {
                        for (const opcao of componente.options) {
                            if (selecionado.includes(opcao.value)) opcao.default = true;
                        }
                    }
                }
            }

            iCmd.editReply({ components: resposta.components });
            return;
        }

        const botaoFinalizado = new MessageButton()
        if (razao === "erro") {
            botaoFinalizado
                .setCustomId(`erro`)
                .setLabel('Ocorreu um erro')
                .setDisabled(true)
                .setStyle('DANGER');
        }
        if (razao === "time") {
            botaoFinalizado
                .setCustomId(`tempo`)
                .setLabel("Tempo esgotado")
                .setDisabled(true)
                .setStyle('SECONDARY');
        }
        if (razao === "idle") {
            botaoFinalizado
                .setCustomId(`tempo`)
                .setLabel("Inatividade")
                .setDisabled(true)
                .setStyle('SECONDARY');
        }

        iCmd.editReply({ components: [{ type: 'ACTION_ROW', components: [botaoFinalizado] }] }).catch();
    });
}


/*
//* Interações de componente em mensagem em um comando
exports.iCCmd = () => {

}

//* Interações de componente em mensagem em uma mensagem
exports.iCMsg = () => {

}

exports.aceitas = function (iCmd, resposta, respostas, filtro) {
    const coletor = resposta.createMessageComponentCollector({ time: 60000 })
    client.log("info", `Coletor de botões iniciado em #${formatarCanal(iCmd.channel)} por @${iCmd.user.tag} msgId:${resposta.id}`);

    coletor.on("collect", iBto => {
        if (filtro(iBto)) {
            client.log("verbose", `@${iBto.user.tag} apertou "${iBto.customId}", mas foi bloqueado msgId:${resposta.id}`);

            const cuidaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.cancelar)
                .setTitle(`⛔ Cuida da sua vida`)
                .setDescription("essa mensagem não foi direcionada a você");
            return iBto.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
        }

        try {
            client.log("verbose", `@${iBto.user.tag} apertou "${iBto.customId}" msgId:${resposta.id}`)
            const parar = respostas[iBto.customId](iBto);
            if (parar) coletor.stop("respondido");
        } catch (err) {
            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${iCmd.commandName} ao ser executado por @${iCmd.user.tag}`, "erro");

            coletor.stop("erro")
        }
    })

    coletor.once('end', (coletado, razao) => {
        client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(iCmd.channel)}, coletando ${coletado.size} interações msgId:${resposta.id}`);

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
        if (razao === "respondido") return


        iCmd.editReply({
            content: resposta.content || null,
            embeds: resposta.embeds,
            components: [{ type: 'ACTION_ROW', components: [botao] }],
        }).catch();
    });
}


exports.pagina = function (iCmd, resposta, respostas, filtro) {
    const coletor = resposta.createMessageComponentCollector({ time: 180000, idle: 60000 })
    client.log("info", `Coletor de botões iniciado em #${formatarCanal(iCmd.channel)} por @${iCmd.user.tag} msgId:${resposta.id}`)

    coletor.on("collect", iBto => {
        if (filtro(iBto)) {
            client.log("verbose", `@${iBto.user.tag} apertou "${iBto.customId}", mas foi bloqueado msgId:${resposta.id}`);

            const cuidaEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.nao)
                .setTitle(`⛔ Cuida da sua vida`)
                .setDescription("essa mensagem não foi direcionada a você");
            return iBto.reply({ content: null, embeds: [cuidaEmbed], ephemeral: true })
        }

        try {
            const { parar, paginaAtual, paginaTotal } = respostas[iBto.customId](iBto);
            client.log("verbose", `@${iBto.user.tag} apertou "${iBto.customId}" pagina: ${paginaAtual}/${paginaTotal} msgId:${resposta.id}`)
            if (parar) coletor.stop("fechado");
        } catch (err) {
            client.log("erro", err.stack)
            client.log("comando", `Ocorreu um erro em ${iCmd.commandName} ao ser executado por @${iCmd.user.tag}`, "erro");

            coletor.stop("erro")
        }
    })

    coletor.once('end', (coletado, razao) => {
        client.log("info", `Coletor de botões terminado por ${razao} em #${formatarCanal(iCmd.channel)}, coletando ${coletado.size} interações msgId:${resposta.id}`);

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

        iCmd.editReply({
            content: resposta.content || null,
            embeds: resposta.embeds,
            components: [{ type: 'ACTION_ROW', components: [botao] }],
        }).catch();
    });
}*/
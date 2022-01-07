const { MessageButton, MessageEmbed } = require("discord.js");
const { traduzirPerms } = require("../../modulos/utils");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
    //* Infomações do comando
    emoji: "ℹ️",
    nome: "ajuda",
    sinonimos: [],
    descricao: "Mostra a lista com todos os comandos",
    exemplos: [
        { comando: "ajuda", texto: "Mostra a lista de categorias dos comandos" },
        { comando: "ajuda [número]", texto: "Mostra a lista com todos os comandos de uma categoria" },
        { comando: "ajuda [comando]", texto: "Mostra ajuda sobre um comando específico" }
    ],
    args: "{comando}",
    opcoes: [
        {
            name: "comando",
            description: "Nome de um comando",
            type: client.defs.tiposOpcoes.STRING,
            required: false,
        },
    ],
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
    suporteBarra: true,
    testando: true,

    //* Comando
    async executar(iCmd, opcoes) {
        if (opcoes.comando) {
            const cmd = client.comandos.get(opcoes.comando);
            if (!cmd) return client.responder(iCmd, "bloqueado", "Comando não encontrado", "Não encontrei nenhum comando com esse nome, tenha certeza que escreveu certo");

            const uso = [];
            for (const opcao of cmd.opcoes) uso.push(`[\`[${opcao.name}]\`](https://nao.clique/de-hover-sobre '${opcao.description}')`)


            const formatarExemplos = (exemplosArray) => {
                let exemplos = "";

                for (const exemplo of exemplosArray) {
                    exemplos += `\n[\`${client.prefixo}${exemplo.comando}\`](https://nao.clique/de-hover-sobre '${exemplo.texto}')`
                }
                return exemplos;
            }

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(`ℹ️ Ajuda sobre ${cmd.nome}`)
                .setDescription(cmd.descricao)
                .addField('❓ Uso', `${client.prefixo}${cmd.nome} ${uso.join(" ")}`)
            if (cmd.exemplos.length > 0) Embed.addField("📖 Exemplos", formatarExemplos(cmd.exemplos));
            if (cmd.sinonimos.length > 0) Embed.addField("🔀 Sinônimos", `\`${cmd.sinonimos.join("`\n`")}\``);
            if (cmd.permissoes.usuario > 0) Embed.addField("📛 Permissão necessária", `\`${traduzirPerms(cmd.permissoes.usuario).join("`\n`")}\``);
            await iCmd.reply({ content: null, embeds: [Embed], ephemeral: true }).catch();

        } else {
            //TODO Adicionar um SelectMenu no baguio
            let embedsarray = []
            const capitalizar = (string) => string.charAt(0).toUpperCase() + string.slice(1);

            const menuEmbed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle('ℹ️ Ajuda')
                .setDescription("Escreva [`!ajuda [comando]`](https://nao.clique/de.hover '!ajuda ping\n!ajuda avatar') para receber ajuda de um comando")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            for (const id of Object.keys(client.defs.categorias)) {
                const categoria = client.defs.categorias[id];
                if (categoria.escondido) break;

                menuEmbed.addField(
                    `${categoria.emoji} ${capitalizar(categoria.nome)}`,
                    `${categoria.descricao}`
                );

                const comandos = client.comandos.filter(c => c.categoria === id).map(c => c);

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`📃 Comandos de ${categoria.nome}`)
                    .setDescription(categoria.descricao)
                for (const comando of comandos) {
                    Embed.addField(
                        `${comando.emoji} ${capitalizar(comando.nome)}${comando.sinonimos.length > 0 ? ` (${comando.sinonimos.join(", ")})` : ""}`,
                        `${comando.descricao}`
                    );
                }

                embedsarray.push(Embed)
            }
            embedsarray.unshift(menuEmbed.setFooter({ text: `Veja outras páginas, clicando nos botões • Página 0/${embedsarray.length}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) }))

            var paginaAtual = 0;
            const paginaTotal = embedsarray.length - 1;

            const voltar = new MessageButton()
                .setCustomId(`voltar`)
                .setLabel('<<')
                .setDisabled(true)
                .setStyle('SECONDARY');
            const menu = new MessageButton()
                .setCustomId('menu')
                .setLabel('O')
                .setDisabled(true)
                .setStyle("PRIMARY")
            const progredir = new MessageButton()
                .setCustomId('progredir')
                .setLabel('>>')
                .setDisabled(false)
                .setStyle("SECONDARY");
            let botoes = [voltar, menu, progredir]

            const resposta = await iCmd.reply({
                content: null,
                embeds: [menuEmbed],
                components: [{ type: 'ACTION_ROW', components: botoes }],
                fetchReply: true,
                ephemeral: true
            }).catch();

            const respostas = {
                async voltar(iBto) {
                    if (paginaAtual <= 0) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`);
                    --paginaAtual

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(paginaTotal <= paginaAtual)
                    ];
                    await iBto.update({
                        embeds: [embedsarray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return false
                },
                async menu(iBto) {
                    if (paginaAtual === 0) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`);
                    paginaAtual = 0

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(paginaTotal <= paginaAtual)
                    ];
                    await iBto.update({
                        embeds: [embedsarray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return false
                },
                async progredir(iBto) {
                    if (paginaTotal <= paginaAtual) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${resposta.id})`);
                    ++paginaAtual

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(paginaTotal <= paginaAtual)
                    ];
                    await iBto.update({
                        embeds: [embedsarray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual}/${paginaTotal}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return false
                }
            }

            //* Coletor de interações
            const filtro = (i) => i.user.id !== iCmd.user.id
            coletorICCmd(iCmd, resposta, respostas, filtro);
        }
    }
};

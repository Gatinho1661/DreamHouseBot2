const { MessageButton, MessageEmbed } = require("discord.js");
const { traduzirPerms } = require("../../modulos/utils");
const { pagina } = require("../../utilidades/interações")

module.exports = {
    //* Infomações do comando
    emoji: "ℹ️",
    nome: "ajuda",
    sinonimos: ["help", "comandos"],
    descricao: "Mostra a lista com todos os comandos",
    exemplos: [
        { comando: "ajuda", texto: "Mostra a lista de categorias dos comandos" },
        { comando: "ajuda [número]", texto: "Mostra a lista com todos os comandos de uma categoria" },
        { comando: "ajuda [comando]", texto: "Mostra ajuda sobre um comando específico" }
    ],
    args: "({numeroPag} ou {comando})",
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

    //* Comando
    async executar(msg, args) {
        if (args[0]) {
            const comando = client.comandos.find(c => c.nome === args[0] || c.sinonimos.includes(args[0]));

            if (comando) {
                const regex = new RegExp(`{(${Object.keys(client.defs.tiposArgs).join("|")})}`, "g");
                const uso = comando.args.replace(regex, e => client.defs.tiposArgs[e.replace(/{|}/g, "")]);

                const formatarExemplos = (exemplosArray) => {
                    let exemplos = "";

                    for (const exemplo of exemplosArray) {
                        exemplos += `\n[\`${client.prefixo}${exemplo.comando}\`](https://nao.clique/de-hover-sobre '${exemplo.texto}')`
                    }
                    return exemplos;
                }

                const Embed = new MessageEmbed()
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`ℹ️ Ajuda sobre ${comando.nome}`)
                    .setDescription(comando.descricao)
                    .addField('❓ Uso', `${client.prefixo}${comando.nome} ${uso}`)
                if (comando.exemplos.length > 0) Embed.addField("📖 Exemplos", formatarExemplos(comando.exemplos));
                if (comando.sinonimos.length > 0) Embed.addField("🔀 Sinônimos", `\`${comando.sinonimos.join("`\n`")}\``);
                if (comando.permissoes.usuario > 0) Embed.addField("📛 Permissão necessária", `\`${traduzirPerms(comando.permissoes.usuario).join("`\n`")}\``);
                msg.channel.send({ content: null, embeds: [Embed], reply: { messageReference: msg } }).catch(console.error);
            } else {
                client.responder(msg, this, "bloqueado", "Comando não encontrado", "Não encontrei nenhum comando com esse nome, tenha certeza que escreveu certo")
            }
        } else {
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
            embedsarray.unshift(menuEmbed.setFooter(`Veja outras páginas, clicando nos botões • Página 0/${embedsarray.length}`))

            var paginaAtual = 0;

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

            const resposta = await msg.channel.send({
                content: null,
                embeds: [menuEmbed],
                components: [{ type: 'ACTION_ROW', components: botoes }],
                reply: { messageReference: msg }
            }).catch();

            const respostas = {
                voltar(i) {
                    if (paginaAtual === 0) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${msg.id})`);
                    --paginaAtual

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(embedsarray.length - 1 <= paginaAtual)
                    ];
                    i.update({
                        content: resposta.content || null,
                        embeds: [embedsarray[paginaAtual]],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return { parar: false, paginaAtual, paginaTotal: embedsarray.length - 1 }
                },
                menu(i) {
                    if (paginaAtual === 0) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${msg.id})`);
                    paginaAtual = 0

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(embedsarray.length - 1 <= paginaAtual)
                    ];

                    i.update({
                        content: resposta.content || null,
                        embeds: [embedsarray[paginaAtual]],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return { parar: false, paginaAtual, paginaTotal: embedsarray.length - 1 }
                },
                progredir(i) {
                    if (embedsarray.length - 1 <= paginaAtual) return client.log("aviso", `Comando "${module.exports.nome}" com paginas dessincronizadas (${msg.id})`);
                    ++paginaAtual

                    botoes = [
                        voltar.setDisabled(paginaAtual <= 0),
                        menu.setDisabled(paginaAtual <= 0),
                        progredir.setDisabled(embedsarray.length - 1 <= paginaAtual)
                    ];

                    i.update({
                        content: resposta.content || null,
                        embeds: [embedsarray[paginaAtual]],
                        components: [{ type: 'ACTION_ROW', components: botoes }]
                    }).catch();

                    return { parar: false, paginaAtual, paginaTotal: embedsarray.length - 1 }
                }
            }

            //* Coletor de interações
            const filtro = (i) => i.user.id !== msg.author.id
            pagina(this, msg, resposta, respostas, filtro);
        }
    }
};

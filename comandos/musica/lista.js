const { MessageEmbed, MessageButton } = require("discord.js");
const { criarBarraProgresso } = require("../../modulos/utils");
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
    //* Infomações do comando
    emoji: "🎶",
    nome: "lista",
    sinonimos: [],
    descricao: "Veja a música que estou tocando",
    exemplos: [
        { comando: "tocando", texto: "Veja a música que estou tocando em um canal de voz" },
    ],
    args: "",
    opcoes: [],
    canalVoz: false,
    contaPrimaria: false,
    apenasServidor: true,
    apenasDono: false,
    nsfw: false,
    permissoes: {
        usuario: [],
        bot: ["SEND_MESSAGES"]
    },
    cooldown: 1,
    escondido: false,
    suporteBarra: true,
    testando: true,

    //* Comando
    async executar(iCmd) {
        // Pegar fila de músicas do servidor
        const filaMusicas = client.distube.getQueue(iCmd.guild);

        // Caso não tenha
        if (!filaMusicas) return client.responder(iCmd, "bloqueado", "Está bem quieto aqui...", "Nenhuma música está sendo tocada nesse servidor")

        const musicaTocando = filaMusicas.songs[0];
        const barraProgresso = criarBarraProgresso(filaMusicas.currentTime / musicaTocando.duration);

        const repeticao = {
            0: "Desligado",
            1: "Repetindo música",
            2: "Repetindo lista de reprodução"
        };

        //* Separar memes em grupos de 5
        const gruposDe = 5; // Define qual é o tamanho do grupo
        const musicas = []
        for (let i = 0, tamanho = filaMusicas.songs.length; i < tamanho; i += gruposDe) {
            musicas.push(filaMusicas.songs.slice(i, i + gruposDe));
        }

        //* Criar paginas com a lista de músicas
        let embedsArray = []
        let posicaoMusica = 0;
        for (const listaMusicas of musicas) {

            // Lista de próximas músicas
            let proximasMusicas = [];
            for (const musica of listaMusicas) {
                if (posicaoMusica === 0) {
                    posicaoMusica++
                    continue
                }

                proximasMusicas.push(`> \`${posicaoMusica}.\` **${musica.name}**\n`
                    + `> 👤 ${musica.member.toString()} │ ⏳ ${musicaTocando.formattedDuration}`
                );

                posicaoMusica++
            }

            const Embed = new MessageEmbed()
                .setColor(client.defs.corEmbed.normal)
                .setTitle(`${this.emoji} Lista de reprodução`)
                .addField(
                    "🎵 Tocando agora",
                    `>>> ▶️ **${musicaTocando.name}**`
                    + `\n👤 ${musicaTocando.member.toString()}\n⏳ [${barraProgresso}] [${filaMusicas.formattedCurrentTime}/${musicaTocando.formattedDuration}]`
                )
                .addField(
                    "▶️ Próximo a tocar",
                    proximasMusicas.join("\n\n") || "Nenhuma música adicionada"
                )
                .addField(
                    "🎛️ Configurações",
                    `>>> 🔊 ${filaMusicas.volume}% │ `
                    + `🎚️ ${filaMusicas.filters.join(", ") || "Nenhum"} │ `
                    + `🔁 ${repeticao[filaMusicas.repeatMode]} │ `
                    + `⏭ ${filaMusicas.autoplay ? "Ligado" : "Desligado"}`
                )

            embedsArray.push(Embed);
        }

        var paginaAtual = 0;
        const paginaTotal = embedsArray.length - 1;

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
            embeds: [embedsArray[0].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual + 1}/${paginaTotal + 1}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
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
                    embeds: [embedsArray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual + 1}/${paginaTotal + 1}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
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
                    embeds: [embedsArray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual + 1}/${paginaTotal + 1}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
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
                    embeds: [embedsArray[paginaAtual].setFooter({ text: `Veja outras páginas, clicando nos botões • Página ${paginaAtual + 1}/${paginaTotal + 1}`, iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) })],
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
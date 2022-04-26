const { MessageButton, MessageEmbed } = require("discord.js");
const { Queue, Song } = require("distube"); // eslint-disable-line no-unused-vars
const { encontrarPosicao } = require("../../modulos/utils");

// Emitido quando uma música começa a tocar
module.exports = {
    nome: "playSong",
    once: false, // Se deve ser executado apenas uma vez
    origem: client.distube,

    /**
     * 
     * @param {Queue} filaMusicas 
     * @param {Song} musica 
     */
    async executar(filaMusicas, musica) {
        client.log("musica", `Tocando música: "${musica.name}" em: ${filaMusicas.voiceChannel?.name}`);

        const posicao = encontrarPosicao(filaMusicas, musica);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musica.url);
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`▶️ Tocando música`)
            .setDescription(`[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor') - ${musica.name}`)
            .addField("👤 Adicionado por", `${musica.member.toString()}`, true)
            .addField("🔢 Posição", `${posicao.posicaoMusica}/${posicao.tamanhoFila}`, true)
            .addField("⏳ Duração", `${musica.formattedDuration}`, true)
            .setImage(musica.thumbnail)
            .setFooter({ text: `Essa mensagem será apagada quando essa música acabar` });
        const msgTocando = await filaMusicas.textChannel.send({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }],
            reply: {
                messageReference: musica.metadata?.msgAdicionadaEm,
                failIfNotExists: false
            }
        }).catch();

        const msgsParaApagar = musica.metadata?.msgsParaApagar || [];
        msgsParaApagar.push(msgTocando)

        // Adiciona a mensagem que é enviada quanto uma música começa a tocar
        // na lista de mensagens para apagar depois que a música finalizar
        musica.metadata.msgsParaApagar = msgsParaApagar;
    }
}
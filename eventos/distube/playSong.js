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
        console.debug(`Tocando música: ${musica.name} (${musica.metadata?.id}) em: ${filaMusicas.voiceChannel?.name}`)

        const metadata = musica.metadata;
        const posicao = encontrarPosicao(filaMusicas, musica);

        const link = new MessageButton()
            .setLabel("Ir para música")
            .setStyle("LINK")
            .setURL(musica.url);
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setTitle(`▶️ Tocando música`)
            .setDescription(`${musica.name}`)
            .setImage(musica.thumbnail)
            .addField("👤 Autor", `[${musica.uploader.name}](${musica.uploader.url} 'Ir para autor')`, true)
            .addField("🔢 Posição", `${posicao.posicaoMusica}/${posicao.tamanhoFila}`, true)
            .addField("⏳ Duração", `${musica.formattedDuration}`, true)
            .setFooter({ text: `Adicionado por ${musica.member.displayName}`, iconURL: musica.member.displayAvatarURL({ dynamic: true, size: 32 }) });
        const msg = {
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }

        let msgTocando = null;

        // Responde o comando se tiver apenas uma música adicionada a lista
        // se não envia uma mensagem separada
        if (posicao.tamanhoFila > 1) {
            if (metadata?.msgAdicionadaEm) msgTocando = await metadata.msgAdicionadaEm.reply(msg).catch();
            else msgTocando = await filaMusicas.textChannel.send(msg).catch(); // Caso a música não seja adicionada por ninguém
        } else await metadata.iCmd.editReply(msg).catch();

        // Define a mensagem que é enviada quanto uma música começa a tocar
        // para poder apagar depois que ela finalizar
        musica.metadata.msgTocando = msgTocando; // eslint-disable-line require-atomic-updates
    }
}
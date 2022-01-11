const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🏠",
    nome: "servidor",
    sinonimos: [],
    descricao: "Mostra informações do servidor",
    exemplos: [
        { comando: "usuario", texto: "Mostra as do servidor" }
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
    suporteBarra: true,
    testando: false,

    //* Comando
    async executar(iCmd) {
        const servidor = iCmd.guild;

        const membrosNormais = servidor.members.cache.filter(membro => !membro.user.bot).size;
        const bots = servidor.members.cache.filter(membro => membro.user.bot).size;

        const canaisTexto = servidor.channels.cache.filter(canal => canal.type === "GUILD_TEXT").size;
        const canaisVoz = servidor.channels.cache.filter(canal => canal.type === "GUILD_VOICE" || "GUILD_STAGE_VOICE").size;

        const emotesNormais = servidor.emojis.cache.filter(emote => !emote.animated).size;
        const emotesAnimados = servidor.emojis.cache.filter(emote => emote.animated).size;

        const figurinhas = servidor.stickers.cache.size;

        const link = new MessageButton()
            .setLabel("Link do icon")
            .setStyle("LINK")
            .setURL(servidor.iconURL({ dynamic: true, size: 4096 }));
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.normal)
            .setAuthor({ name: servidor.name, iconURL: servidor.iconURL({ dynamic: true, size: 32 }) })
            .setThumbnail(servidor.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👑 Dono do servidor', value: `<@${servidor.ownerId}>`, inline: true },
                { name: '📆 Criado em', value: `<t:${Math.round(servidor.createdAt.getTime() / 1000)}:f>`, inline: true },
                { name: '👥 Membros', value: `Pessoas: ${membrosNormais}\nBots: ${bots}`, inline: true },
                { name: `💬 Canais (${servidor.channels.cache.size})`, value: `Texto: ${canaisTexto}\nVoz: ${canaisVoz}`, inline: true },
                { name: '😀 Emotes', value: `Normais: ${emotesNormais}\nAnimados: ${emotesAnimados}\nFigurinhas: ${figurinhas}`, inline: true },
                { name: '💠 Boosts', value: `Nível: ${servidor.premiumSubscriptionCount}\nTotal de boosts: ${servidor.premiumSubscriptionCount}`, inline: true },
                { name: '🆔 ID do servidor', value: servidor.id, inline: true },
            );
        await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }).catch();
    }
};

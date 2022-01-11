const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "👤",
    nome: "usuario",
    sinonimos: [],
    descricao: "Mostra informações de usuário",
    exemplos: [
        { comando: "usuario", texto: "Mostra a suas informações de usuário" },
        { comando: "usuario [usuario]", texto: "Mostra a informações de usuário de uma pessoa" }
    ],
    args: "",
    opcoes: [
        {
            name: "usuario",
            description: "Usuário para ver as informações",
            type: client.defs.tiposOpcoes.USER,
            required: false,
        },
    ],
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
    async executar(iCmd, opcoes) {
        const usuario = opcoes.usuario?.membro || iCmd.member;

        //* Organizar cargos
        let cargos = usuario.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .slice(0, -1) // Remover cargo eveyone
            .join("\n");
        if (cargos.length > 500) cargos = "Muitos cargos!";
        if (!cargos) cargos = "Nenhum cargo";

        //* Traduzir status
        const status = {
            online: { texto: "Online", emoji: "🟢" },
            idle: { texto: "Ausente", emoji: "🟡" },
            dnd: { texto: "Não perturbe", emoji: "🔴" },
            offline: { texto: "Offline ou invisível", emoji: "⚪" },
            desconhecido: { texto: "Desconhecido", emoji: "⚫" }
        }[usuario.presence?.status || "desconhecido"];

        const link = new MessageButton()
            .setLabel("Link do avatar")
            .setStyle("LINK")
            .setURL(usuario.user.displayAvatarURL({ dynamic: true, size: 4096 }));
        const Embed = new MessageEmbed()
            .setColor(usuario.displayColor ? usuario.displayHexColor : client.defs.corEmbed.normal)
            .setAuthor({ name: usuario.user.tag, iconURL: usuario.user.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setThumbnail(usuario.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: `${status.emoji} Status`, value: status.texto, inline: false },
                { name: '🌟 Criado em', value: `<t:${Math.round(usuario.user.createdAt.getTime() / 1000)}:f>`, inline: false },
                { name: '➡️ Entrou em', value: `<t:${Math.round(usuario.joinedAt.getTime() / 1000)}:f>`, inline: false },
                { name: '💠 Impulsionando desde', value: usuario.premiumSince ? `<t:${Math.round(usuario.premiumSince.getTime() / 1000)}:f>` : "Nunca", inline: false },
                { name: '🆔 ID do usuário', value: usuario.id, inline: false },
                { name: `🔰 Cargos (${usuario.roles.cache.size - 1})`, value: cargos, inline: false },
            );
        await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [link] }]
        }).catch();
    }
};

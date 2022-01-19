const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    //* Infomações do comando
    emoji: "🖼️",
    nome: "avatar",
    sinonimos: [],
    descricao: "Mostra o avatar do usuário",
    exemplos: [
        { comando: "avatar", texto: "Mostra o seu avatar" },
        { comando: "avatar [usuario]", texto: "Mostra o avatar do usuário" }
    ],
    args: "",
    opcoes: [
        {
            name: "usuario",
            description: "Usuário para ver o avatar",
            type: client.defs.tiposOpcoes.USER,
            required: false,
        }
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
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {
        const usuario = opcoes.usuario?.membro || iCmd.member;

        const avatar = new MessageButton()
            .setLabel("Link do avatar")
            .setStyle("LINK")
            .setURL(usuario.user.displayAvatarURL({ dynamic: true, size: 4096 }));
        const Embed = new MessageEmbed()
            .setColor(usuario.displayColor ? usuario.displayHexColor : client.defs.corEmbed.normal)
            .setTitle(`🖼️ Avatar de ${usuario.displayName}`)
            .setImage(usuario.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: [avatar] }]
        }).catch();
    },

    //* Comandos de menu contextual
    nomeCtx: "Avatar",
    tipoCtx: client.defs.tiposComando.USER,
    async executarCtx(iCtx) {
        const opcoes = {
            usuario: {
                membro: iCtx.targetMember
            }
        }
        await this.executar(iCtx, opcoes);
    }
};

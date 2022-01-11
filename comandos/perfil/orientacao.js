const { MessageButton, MessageEmbed } = require("discord.js");
const { coletorICCmd } = require("../../utilidades/coletores");
const { capitalizar } = require("../../modulos/utils");

module.exports = {
    //* Infomações do comando
    emoji: "🏳️‍🌈",
    nome: "orientacao",
    sinonimos: [],
    descricao: "Escolha sua orientação sexual",
    exemplos: [
        { comando: "orientacao [orientacao]", texto: "Define sua orientação sexual" }
    ],
    args: "",
    opcoes: [
        {
            name: "orientacao",
            description: "A orientação que se indentifica",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
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
    escondido: false,
    suporteBarra: true,
    testando: true,

    //* Comando
    async executar(iCmd, opcoes) {

        //* define os dados do usuario da pessoa caso nao tenha
        client.usuarios.ensure(`${iCmd.user.id}`, {
            nome: iCmd.user.username,
            aniversario: null,
            idade: null,
            orientacao: null,
            pronome: null
        });

        //* Pegar dados do usuário
        const usuario = client.usuarios.get(iCmd.user.id);

        const orientacao = capitalizar(opcoes.orientacao.toLowerCase()) // Capitalizar

        if (!/([a-zA-Zà-úÀ-Ú]{3,}$)/i.test(orientacao)) return client.responder(iCmd, "bloqueado", "Escrito errado", "Sua orientação só pode conter letras e ser maior que 2 caracteres");

        const sim = new MessageButton()
            .setCustomId(`sim`)
            .setLabel(`Sim`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);
        const editar = new MessageButton()
            .setCustomId("editar")
            .setLabel("Editar")
            .setDisabled(false)
            .setStyle("PRIMARY");
        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("DANGER");
        const adicionando = usuario.pronome === null;
        let botoes = adicionando ? [sim, cancelar] : [editar, cancelar];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(adicionando ? '🏳️‍🌈 Definir orientação sexual' : '🏳️‍🌈 Editar orientação sexual')
            .setFooter({ text: "Escolha clicando nos botões", iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) });
        adicionando
            ? Embed.addFields([
                { name: "Orientação sexual", value: orientacao, inline: false },
            ])
            : Embed.addFields([
                { name: "Sua orientação sexual", value: usuario.orientacao, inline: false },
                { name: "Você deseja editar para", value: orientacao, inline: false },
            ])
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            fetchReply: true,
            ephemeral: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            async sim(iCMsg) {
                client.usuarios.set(iCmd.user.id, orientacao, 'orientacao');
                client.log("info", `Orientação sexual de ${iCmd.user.tag} foi definido para ${orientacao}`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("🏳️‍🌈 Orientação sexual adicionado")
                    .setFooter(null);
                await iCMsg.update({ embeds: [Embed] });

                return true;
            },
            async editar(iCMsg) {
                client.usuarios.set(iCmd.user.id, orientacao, 'orientacao');
                client.log("info", `Orientação sexual de ${iCmd.user.tag} foi definido para ${orientacao}`);

                Embed
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle("🏳️‍🌈 Orientação sexual editado")
                    .setFooter(null);
                await iCMsg.update({ embeds: [Embed] });

                return true;
            },
            async cancelar(iCMsg) {
                client.log("info", `Cancelado`);

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle("❌ Cancelado")
                    .setFooter(null);
                await iCMsg.update({ embeds: [Embed] });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== iCmd.user.id
        coletorICCmd(iCmd, resposta, respostas, filtro);
    }
};
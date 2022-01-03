const { MessageButton, MessageEmbed } = require("discord.js");
const coletorInteracoes = require("../../utilidades/coletorInterações");

module.exports = {
    //* Infomações do comando
    emoji: "⚧",
    nome: "pronome",
    sinonimos: [],
    descricao: "Escolha seu pronome que se indentifica",
    exemplos: [
        { comando: "pronome [pronome]", texto: "Escolhe o pronome que se indentifica" }
    ],
    args: "",
    opcoes: [
        {
            name: "pronome",
            description: "O pronome que se indentifica",
            type: client.constantes.ApplicationCommandOptionTypes.STRING,
            required: true,
            choices: [
                {
                    name: "Ele/Dele",
                    value: "ele"
                },
                {
                    name: "Ela/Dela",
                    value: "ela"
                },
                {
                    name: "Elu/Delu",
                    value: "elu"
                }
            ]
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

        const pronomes = { "ele": "Ele/Dele", "ela": "Ela/Dela", "elu": "Elu/Delu" };

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
            .setTitle(adicionando ? '⚧ Definir pronome' : '⚧ Editar pronome')
            .setFooter({ text: "Escolha clicando nos botões", iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 16 }) });
        adicionando
            ? Embed.addFields([
                { name: "Pronome", value: pronomes[opcoes.pronome], inline: false },
            ])
            : Embed.addFields([
                { name: "Seu pronome", value: pronomes[usuario.pronome], inline: false },
                { name: "Você deseja editar para", value: pronomes[opcoes.pronome], inline: false },
            ])
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            fetchReply: true,
            ephemeral: true
        }).catch();

        //* Respostas para cada botão apertado
        const executar = {
            async sim(iCMsg) {
                client.usuarios.set(iCmd.user.id, opcoes.pronome, 'pronome');
                client.log("info", `Pronome de ${iCmd.user.tag} foi definido para ${pronomes[opcoes.pronome]}`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("⚧ Pronome adicionado")
                    .setFooter(null);
                await iCMsg.update({ embeds: [Embed] });

                return true;
            },
            async editar(iCMsg) {
                client.usuarios.set(iCmd.user.id, opcoes.pronome, 'pronome');
                client.log("info", `Pronome de ${iCmd.user.tag} foi definido para ${pronomes[opcoes.pronome]}`);

                Embed
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle("⚧ Pronome editado")
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
        coletorInteracoes(iCmd, resposta, executar, filtro);
    }
};
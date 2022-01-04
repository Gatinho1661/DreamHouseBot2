const { MessageButton, MessageEmbed } = require("discord.js");
const chrono = require('chrono-node');
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
    //* Infomações do comando
    emoji: "🎂",
    nome: "aniversario",
    sinonimos: ["aniversário"],
    descricao: "Edite sua data de aniversário e sua idade",
    exemplos: [
        { comando: "aniversario [data]", texto: "Define seu aniversário e sua idade" }
    ],
    args: "",
    opcoes: [
        {
            name: "data",
            description: "A data em que você nasceu",
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
        const aniversario = new Date(usuario.aniversario);

        //* Transformar texto em data
        let data = chrono.pt.strict.parseDate(opcoes.data)
        if (!data) return client.responder(iCmd, "uso", "Argumentos errados", "Você tem que enviar sua data de nascimento");
        data.setHours(0, 0, 0);

        //* Calcular idade
        const idade = new Date().getFullYear() - data.getFullYear();
        if (idade <= 1) return client.responder(iCmd, "uso", "Argumentos errados", `Você tem que enviar sua data de nascimento`);

        if (aniversario.getTime() === data.getTime()) return client.responder(iCmd, "bloqueado", "Data errada", `Sua data de nascimento já está definido para esse dia`);

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
        const adicionando = usuario.aniversario === null;
        let botoes = adicionando ? [sim, cancelar] : [editar, cancelar];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(adicionando ? '🎂 Adicionar aniversário' : '🎂 Editar aniversário')
            .setFooter({ text: "Escolha clicando nos botões", iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 16 }) });
        adicionando
            ? Embed.addFields([
                { name: "Você nasceu em", value: `<t:${Math.floor(data.getTime() / 1000)}:d> <t:${Math.floor(data.getTime() / 1000)}:R>`, inline: false },
            ])
            : Embed.addFields([
                { name: "Você nasceu em", value: `<t:${Math.floor(aniversario.getTime() / 1000)}:d> <t:${Math.floor(aniversario.getTime() / 1000)}:R>`, inline: false },
                { name: "Você deseja editar para", value: `<t:${Math.floor(data.getTime() / 1000)}:d> <t:${Math.floor(data.getTime() / 1000)}:R>`, inline: false },
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
                client.usuarios.set(iCmd.user.id, data.toISOString(), 'aniversario');
                client.usuarios.set(iCmd.user.id, idade, 'idade');
                client.log("info", `Aniversário de ${iCmd.user.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle("🎂 Aniversário adicionado")
                    .setFooter(null);
                await iCMsg.update({ embeds: [Embed] });

                return true;
            },
            async editar(iCMsg) {
                client.usuarios.set(iCmd.user.id, data.toISOString(), 'aniversario');
                client.usuarios.set(iCmd.user.id, idade, 'idade');
                client.log("info", `Aniversário de ${iCmd.user.tag} foi definido para ${data.toLocaleDateString()} e com ${idade} anos`);

                Embed
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle("🎂 Aniversário editado")
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
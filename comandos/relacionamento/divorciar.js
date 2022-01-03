const { MessageButton, MessageEmbed } = require("discord.js");
const coletorInteracoes = require("../../utilidades/coletorInterações");

module.exports = {
    //* Infomações do comando
    emoji: "💔",
    nome: "divorciar",
    sinonimos: ["divorcio", "divorce"],
    descricao: "Divorcie da pessoa que está casada",
    exemplos: [
        { comando: "divorciar", texto: "Divorciar-se do seu cônjuge" },
    ],
    args: "",
    opcoes: [],
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
    testando: true,

    //* Comando
    async executar(iCmd) {

        // Define o relacionamento da pessoa caso nao tenha
        client.relacionamentos.ensure(`${iCmd.user.id}`, {
            usuario: iCmd.user.username,
            conjugeId: null,
            conjugeNome: null,
            dataCasamento: null,
            amantes: [],
        });

        let usuRelacao = client.relacionamentos.get(iCmd.user.id);
        if (!usuRelacao.conjugeId) return client.responder(iCmd, "bloqueado", "Você não está casado com ninguém", "Se você já esqueceu disso, provavelmente não ta indo muito bem as coisas...");

        let conjugeRelacao = client.relacionamentos.get(usuRelacao.conjugeId);
        if (!conjugeRelacao.conjugeId || conjugeRelacao.conjugeId !== iCmd.user.id) return client.responder(iCmd, "erro", "Ocorreu um erro desconhecido", "Uhm como que isso aconteceu?");

        const conjugeUsu = await iCmd.guild.members.fetch(usuRelacao.conjugeId);

        const divorciar = new MessageButton()
            .setCustomId(`divorciar`)
            .setLabel(`Divorciar`)
            .setDisabled(false)
            .setStyle(`DANGER`);
        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("PRIMARY");
        let botoes = [divorciar, cancelar];

        //* Divorcio!
        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`💔 Divorcio!`)
            .setDescription(`Você tem certeza que quer se divorciar de ${conjugeUsu?.toString() || conjugeRelacao.usuario}?`)
            .setFooter({ text: "Escolha clicando nos botões", iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 16 }) });
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            fetchReply: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            async divorciar(iBtn) {
                usuRelacao = client.relacionamentos.get(iCmd.user.id);
                conjugeRelacao = client.relacionamentos.get(usuRelacao.conjugeId);

                // Confirmar novamente para não ter erro
                if (!usuRelacao.conjugeId) throw new Error("Usuário já está divorciado");
                if (!conjugeRelacao.conjugeId) throw new Error("Conjuge já está divorciado");

                //* Divorciar
                client.relacionamentos.set(iCmd.user.id, null, 'conjugeId');
                client.relacionamentos.set(usuRelacao.conjugeId, null, 'conjugeId');

                client.relacionamentos.set(iCmd.user.id, null, 'conjugeNome');
                client.relacionamentos.set(usuRelacao.conjugeId, null, 'conjugeNome');

                client.relacionamentos.set(iCmd.user.id, null, 'dataCasamento');
                client.relacionamentos.set(usuRelacao.conjugeId, null, 'dataCasamento');

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`💔 Ainda há muito peixe no mar`)
                    .setDescription(`${iCmd.user.toString()} divorciou-se de ${conjugeUsu?.toString() || conjugeRelacao.usuario}`)
                    .setFooter(null);
                await iBtn.update({ embeds: [Embed] });

                client.log("info", `${iCmd.user.username} divorciou-se de ${conjugeUsu?.username || conjugeRelacao.usuario}`);

                return true;
            },
            async cancelar(iBtn) {

                Embed
                    .setColor(client.defs.corEmbed.normal)
                    .setTitle(`💍 Essa foi por pouco`)
                    .setDescription(`${iCmd.user.toString()} cancelou o divorcio com ${conjugeUsu?.toString() || conjugeRelacao.usuario}`)
                    .setFooter(null);
                await iBtn.update({ embeds: [Embed] });

                client.log("info", `${iCmd.user.username} cancelou o divorcio com ${conjugeUsu?.username || conjugeRelacao.usuario}`);

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (iBtn) => iBtn.user.id !== iCmd.user.id;
        coletorInteracoes(iCmd, resposta, respostas, filtro);
    }
};

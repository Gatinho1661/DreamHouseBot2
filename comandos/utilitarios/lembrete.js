const { MessageEmbed, MessageButton } = require("discord.js");
const chrono = require('chrono-node');
const criarLembrete = require('./../../temporizadores/lembretes');
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
    //* Infomações do comando
    emoji: "⏰",
    nome: "lembrete",
    sinonimos: [],
    descricao: "Fazer um lembrete pessoal para você ou marcar um rolê com outras pessoas",
    exemplos: [
        { comando: "lembrete [data] [sobre]", texto: "Fazer um lembrete pessoal" },
        { comando: "lembrete [data] [sobre] [cargo]", texto: "Marcar um rolê com outras pessoas" },
    ],
    args: "{texto} {tempo} ({usuario} ou {cargo})",
    opcoes: [
        {
            name: "data",
            description: "A data ou hora para te lembrar",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
        },
        {
            name: "sobre",
            description: "Sobre o que te lembrar",
            type: client.defs.tiposOpcoes.STRING,
            required: false,
        },
        {
            name: "cargo",
            description: "Um cargo para eu avisar o seu rolê",
            type: client.defs.tiposOpcoes.ROLE,
            required: false,
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
    testando: false,

    //* Comando
    async executar(iCmd, opcoes) {

        const tempo = chrono.pt.parseDate(opcoes.data);
        if (!tempo) return client.responder(iCmd, "bloqueado", "Data inválida", "Não entendi a data que você colocou");

        // Sempre definir data para o futuro
        const agora = new Date()
        if ((agora.getTime() - tempo.getTime()) > 0) tempo.setFullYear(agora.getFullYear() + 1)

        const ms = Math.floor(tempo.getTime() / 1000);

        const sim = new MessageButton()
            .setCustomId(`sim`)
            .setLabel(`Sim`)
            .setDisabled(false)
            .setStyle(`SUCCESS`);
        const cancelar = new MessageButton()
            .setCustomId('cancelar')
            .setLabel('Cancelar')
            .setDisabled(false)
            .setStyle("DANGER");
        let botoes = [sim, cancelar];

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`⏰ Definir um ${opcoes.cargo ? `Rolê` : "Lembrete"}`)
            .addField("📅 Em", `<t:${ms}:R>\n<t:${ms}:f>`)
            .setFooter({ text: "Escolha clicando nos botões", iconURL: iCmd.user.displayAvatarURL({ dynamic: true, size: 32 }) });
        if (opcoes.sobre) Embed.addField("ℹ️ Sobre", opcoes.sobre);
        if (opcoes.cargo) Embed.addField("👥 Com", `${opcoes.cargo}`);

        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            components: [{ type: 'ACTION_ROW', components: botoes }],
            fetchReply: true
        }).catch();

        //* Respostas para cada botão apertado
        const respostas = {
            async sim(iBto) {
                criarLembrete(iCmd, resposta, tempo, opcoes.sobre, opcoes.cargo);

                Embed
                    .setColor(client.defs.corEmbed.sim)
                    .setTitle(`⏰ ${opcoes.cargo ? "Rolê" : "Lembrete"} definido`)
                    .setFooter(null);
                await iBto.update({ embeds: [Embed] });

                return true;
            },
            async cancelar(iBto) {
                client.log("info", `Cancelado`);

                Embed
                    .setColor(client.defs.corEmbed.nao)
                    .setTitle(`❌ ${opcoes.cargo ? "Rolê" : "Lembrete"} cancelado`)
                    .setFooter(null);
                await iBto.update({ embeds: [Embed] });

                return true;
            }
        }

        //* Coletor de interações
        const filtro = (i) => i.user.id !== iCmd.user.id;
        coletorICCmd(iCmd, resposta, respostas, filtro);
    }
}
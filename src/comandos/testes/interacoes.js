const { MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");
///const coletorInteracoes = require("../../utilidades/coletorInterações")
const { coletorICCmd } = require("../../utilidades/coletores");

module.exports = {
    emoji: "",
    nome: "interacoes",
    sinonimos: [],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",
    opcoes: [],

    // Necessário
    canalVoz: false,        // está em um canal de voz
    contaPrimaria: false,   // ser uma conta primaria
    apenasServidor: false,  // está em um servidor
    apenasDono: true,       // ser o dono
    nsfw: false,            // ser um canal NSFW

    permissoes: {
        usuario: [],        // permissões do usuário
        bot: []             // permissões do bot
    },
    cooldown: 1,            // número em segundos de cooldown

    escondido: true,        // comando fica escondido do comando de ajuda

    suporteBarra: true,
    testando: true,

    async executar(iCmd) {

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
        const editar = new MessageButton()
            .setCustomId("editar")
            .setLabel("Editar")
            .setDisabled(false)
            .setStyle("PRIMARY");
        const link = new MessageButton()
            //.setCustomId('link')
            .setURL("https://discord.js.org/#/docs/main/master/class/MessageActionRow?scrollTo=spliceComponents")
            .setLabel('Link')
            //.setDisabled(false)
            .setStyle("LINK");
        let botoes = [sim, cancelar, editar, link];

        const opcoesExemplo = ["Cacto", "Bill", "Osmio", "SrVigor", "alexxxxx", "amelie", "Julea", ",Balerion✨", "youmiyoumo", "anasyke 🌸"];
        const opcoesSelectMenu = []
        let idx = 0
        for (const opcao of opcoesExemplo) {
            opcoesSelectMenu.push({
                label: opcao,
                description: 'descrição',
                value: `${idx}`,
                emoji: {
                    id: null,
                    name: "🐲"
                },
                default: false
            })
            idx++
        }
        const selecao = new MessageSelectMenu()
            .setCustomId("selecione")
            .setPlaceholder("Selecione alguem para remover")
            .setOptions(opcoesSelectMenu)
            .setMaxValues(10);

        const Embed = new MessageEmbed()
            .setColor(client.defs.corEmbed.carregando)
            .setTitle(`Teste`)
            .setDescription("Interacoes");
        const resposta = await iCmd.reply({
            content: null,
            embeds: [Embed],
            fetchReply: true,
            components: [
                { type: 'ACTION_ROW', components: botoes },
                { type: 'ACTION_ROW', components: [selecao] }
            ],
        }).catch();

        /*
        const desativarCoponentes = (componentes, selecionado) => {
            const listaComponentes = []
            for (const componente of componentes) {
                console.debug(componente.style)
                if (componente.style !== "LINK" && componente.type === "BUTTON") {
                    componente.setDisabled(true);

                    console.debug(componente.customId);
                    console.debug(componente.type + "\n");
                    if (componente.customId !== selecionado) componente.setStyle("SECONDARY");
                }
                if (componente.type === "SELECT_MENU") {
                    componente.setDisabled(true);
                    componente.setPlaceholder(selecionado);
                }

                listaComponentes.push(componente);
            }
            return listaComponentes;
        }*/

        const executar = {
            sim(i) {
                //i.reply({ content: "se desitiu q sim" });
                client.log("log", "sim mano", null, false);

                i.update({ content: "se desitiu q sim" });
                return true;
            },
            editar(i) {
                //i.reply({ content: "se desitiu q quer editar" });
                client.log("log", "edita isso mano", null, false);

                i.update({ content: "se desitiu q quer editar" });
                return true;
            },
            cancelar(i) {
                //i.reply({ content: "se desitiu q quer cancelar" });
                client.log("log", "cancela isso mano", null, false);

                i.update({ content: "se desitiu q quer cancelar" });
                return true;
            },
            selecione(i) {

                const selecionados = i.values;
                i.update({ content: selecionados.join(", ") });
                return true;
            }
        }

        const filtro = () => false;
        coletorICCmd(iCmd, resposta, executar, filtro);
    }
}
////const listaCidades = require('./../../data/city.list.json');

const { executarMsg } = require("../dono/comandos");

module.exports = {
    emoji: "",
    nome: "verificarComandos",
    sinonimos: ["vc"],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",

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

    suporteBarra: false,
    testando: true,

    async executarMsg(msg, args) {
        const comandosEnviados = await client.application?.commands.fetch();

        const asOpcoesMudaram = (opcoes1, opcoes2) => {
            const obj1Length = Object.keys(opcoes1).length;
            const obj2Length = Object.keys(opcoes2).length;

            if (obj1Length === obj2Length) return Object.keys(opcoes1).every(key => opcoes1[key] === opcoes2[key]);
            return false;
        }

        client.comandos.each(comando => {
            if (comando.suporteBarra === true || comando.suporteBarra === "ambos") {
                const comandoEnviado = comandosEnviados.find(c => c.name === comando.nome);

                if (!comandoEnviado) return console.debug(`${comando.nome} não foi enviado para o discord`);

            }
        })

        console.debug(comandosEnviados);
        console.debug("\nespaço\n")
        console.debug(comandos);

        //TODO Remover consoles
        //* Definir comandos globalmente
        //await client.application?.commands.set(comandos);
        //console.debug(await client.application?.commands.fetch());

        // Definir comandos de teste
        // if (process.env.SERVER_DE_TESTES) {
        //     await client.application?.commands.set(comandosTeste, process.env.SERVER_DE_TESTES);
        //     console.debug(await client.application?.commands.fetch({ guildId: process.env.SERVER_DE_TESTES }));
        // }
    }
}
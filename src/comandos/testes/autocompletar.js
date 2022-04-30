

module.exports = {
    emoji: "",
    nome: "autocompletar",
    sinonimos: [],
    descricao: "Testa coisas.",
    exemplos: [],
    args: "",
    opcoes: [
        {
            name: "nome",
            description: "Nome do seu meme",
            type: client.defs.tiposOpcoes.STRING,
            required: true,
            autocomplete: true
        },
    ],

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

    async executar(iCmd, opcoes) {
        console.log(opcoes)
        console.log(iCmd.options.data)
        console.log(iCmd.options.get("nome"))
    }
}
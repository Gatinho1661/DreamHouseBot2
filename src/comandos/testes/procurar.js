////const listaCidades = require('./../../data/city.list.json');

module.exports = {
    emoji: "",
    nome: "procurar",
    sinonimos: ["p"],
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

    async executar(msg, args) {
        const listaCidades = null

        const compareTwoStrings = (first, second) => {
            first = first.replace(/\s+/g, '')
            second = second.replace(/\s+/g, '')

            if (first === second) return 1; // identical or empty
            if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

            let firstBigrams = new Map();
            for (let i = 0; i < first.length - 1; i++) {
                const bigram = first.substring(i, i + 2);
                const count = firstBigrams.has(bigram)
                    ? firstBigrams.get(bigram) + 1
                    : 1;

                firstBigrams.set(bigram, count);
            }

            let intersectionSize = 0;
            for (let i = 0; i < second.length - 1; i++) {
                const bigram = second.substring(i, i + 2);
                const count = firstBigrams.has(bigram)
                    ? firstBigrams.get(bigram)
                    : 0;

                if (count > 0) {
                    firstBigrams.set(bigram, count - 1);
                    intersectionSize++;
                }
            }

            return (2.0 * intersectionSize) / (first.length + second.length - 2);
        }

        console.time()
        const procurar = args.join(" ").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
        const cidades = listaCidades.filter(cidade => {
            const cidadeNome = cidade.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

            const valor = compareTwoStrings(cidadeNome, procurar)

            if (valor >= 0.7) {
                console.debug(valor)
                return true
            }
            return false;
        });
        console.log(cidades)
        console.timeEnd()
    }
}
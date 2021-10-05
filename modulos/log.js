const chalk = require('chalk');

module.exports = (tipo, msg, subtipo, semTempo) => {
    const tempo = new Date();
    const logTempo = semTempo ? "" : `[${tempo.toLocaleTimeString()}.${String(tempo.getMilliseconds()).padStart(3, '0')}] `
    if (!client.config.get("log", tipo !== null ? tipo : "normal")) return

    const subTipo = (subtipo) => {
        switch (subtipo) {
            case "critico": // Erros não pegos
                return chalk` {keyword('red') crt}`

            case "erro": // Erros normais
                return chalk` {keyword('maroon') err}`

            case "aviso": // Avisos não nocivos a funcionalidade do bot
                return chalk` {keyword('gold') avs}`

            default:
                return ""
        }
    }

    switch (tipo) {
        // Tudo relacionado ao bot
        case "bot":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('white').black BOT}${subTipo(subtipo)} {keyword('white') ${msg}}`);

        // Erros não pegos
        case "critico":
            return console.error(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('red').black CRITICO}${subTipo(subtipo)} {keyword('red') ${msg}}`);

        // Erros normais
        case "erro":
            return console.error(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('maroon').black ERRO}${subTipo(subtipo)} {keyword('maroon') ${msg}}`);

        // Avisos não nocivos a funcionalidade do bot
        case "aviso":
            return console.warn(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('gold').black AVISO}${subTipo(subtipo)} {keyword('gold') ${msg}}`);

        // Ativadores de um comando
        case "comando":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('mediumseagreen').black COMANDO}${subTipo(subtipo)} {keyword('mediumseagreen') ${msg}}`);

        // Ativadores de um comando
        case "meme":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('mediumaquamarine').black MEME}${subTipo(subtipo)} {keyword('mediumaquamarine') ${msg}}`);

        // Avisos sobre eventos do servidor
        case "servidor":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('darkcyan').black SERVIDOR}${subTipo(subtipo)} {keyword('darkcyan') ${msg}}`);

        // Informações adicionais
        case "info":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('cornflowerblue').black INFO}${subTipo(subtipo)} {keyword('cornflowerblue') ${msg}}`);

        // Tudo sobre a conexão com uma api
        case "api":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgHex("#5865f2").black API}${subTipo(subtipo)} {hex("#5865f2") ${msg}}`);

        // Informações adicionais so que SPAM
        case "verbose":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('mediumpurple').black VERBOSE}${subTipo(subtipo)} {keyword('mediumpurple') ${msg}}`);

        // Log
        case "log":
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{keyword('white')${subTipo(subtipo)} ${msg}}`);

        // Log customizável
        case "custom":
            return console.log(msg)

        default:
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{keyword('dimgray')${subTipo(subtipo)} ${msg}}`);
    }
}

// module.exports("custom", chalk`{bgKeyword('lime').black PASS} {keyword('silver') teste foda}`);
// module.exports("custom", chalk`{bgKeyword('red').black FAIL} {keyword('silver') teste foda}`);
// module.exports("custom", chalk`Testes: {keyword('red') 1 falharam}, {keyword('lime') 1 passaram}, 2 total`);
// module.exports("custom", chalk`Resultado: {bgKeyword('red').black FAIL}`);
// module.exports("custom", chalk`Resultado: {bgKeyword('lime').black PASS}`);

// module.exports("log", "Teste foda")
// module.exports(null, "Teste foda")
// module.exports("bot", "Teste foda")
// module.exports("bot", "Teste foda", "critico")
// module.exports("critico", "Teste foda")
// module.exports("erro", "Teste foda")
// module.exports("aviso", "Teste foda")
// module.exports("comando", "Teste foda")
// module.exports("comando", "Teste foda", "erro")
// module.exports("servidor", "Teste foda")
// module.exports("verbose", "Teste foda")
// module.exports("info", "Teste foda")
// module.exports("info", "Teste foda", "aviso")
// module.exports("api", "Teste foda")

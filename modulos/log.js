const chalk = require('chalk');

module.exports = (tipo, msg, subtipo, semTempo) => {
    const tempo = new Date();
    const logTempo = semTempo ? "" : `[${tempo.toLocaleTimeString()}.${String(tempo.getMilliseconds()).padStart(3, '0')}] `

    const subTipo = (tipo) => {
        switch (tipo) {
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
        case "bot": // Tudo relacionado ao bot
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('white').black BOT}${subTipo(subtipo)} {keyword('white') ${msg}}`);

        case "api": // Tudo sobre a conexão com a api
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgHex("#5865f2").black API}${subTipo(subtipo)} {hex("#5865f2") ${msg}}`);

        case "critico": // Erros não pegos
            return console.error(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('red').black CRITICO}${subTipo(subtipo)} {keyword('red') ${msg}}`);

        case "erro": // Erros normais
            return console.error(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('maroon').black ERRO}${subTipo(subtipo)} {keyword('maroon') ${msg}}`);

        case "aviso": // Avisos não nocivos a funcionalidade do bot
            return console.warn(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('gold').black AVISO}${subTipo(subtipo)} {keyword('gold') ${msg}}`);

        case "comando": // 
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('mediumseagreen').black COMANDO}${subTipo(subtipo)} {keyword('mediumseagreen') ${msg}}`);

        case "servidor": // Avisos sobre eventos do servidor
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('darkcyan').black SERVIDOR}${subTipo(subtipo)} {keyword('darkcyan') ${msg}}`);

        case "info": // Informações adicionais
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('cornflowerblue').black INFO}${subTipo(subtipo)} {keyword('cornflowerblue') ${msg}}`);

        case "verbose": // Informações adicionais so que SPAM
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{bgKeyword('mediumpurple').black VERBOSE}${subTipo(subtipo)} {keyword('mediumpurple') ${msg}}`);

        case "log": // log
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{keyword('white')${subTipo(subtipo)} ${msg}}`);

        default:
            return console.log(chalk`{keyword('dimgray') ${logTempo}}{keyword('dimgray')${subTipo(subtipo)} ${msg}}`);
    }
}

// testar cada log
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

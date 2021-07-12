const fs = require("fs");
const log = require("./modulos/log.js");
const chalk = require('chalk');

const inicio = new Date();
const tab = " "             //* Espaçamento para ficar bonitin no log
const comandos = []         //* Lista de todos os comandos
let sucessos = 0            //* Número total de testes sucedidos
let erros = 0               //* Número total de testes falhados
let ignorados = 0           //* Número total de testes ignorados
let permsTraduzidas = [     //* Lista de todas as permissão
    "ADMINISTRATOR",
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
    "USE_APPLICATION_COMMANDS",
    "REQUEST_TO_SPEAK"
]

log("custom", chalk`{keyword('white') Verificando comandos}`)

process.on('exit', (code) => {
    console.debug(`Fechando em ${code}`);
})

for (const pasta of fs.readdirSync(__dirname + `/comandos/`)) {
    for (const arquivo of fs.readdirSync(__dirname + `/comandos/${pasta}`)) {
        if (!arquivo.endsWith(".js")) continue
        try {
            log("custom", chalk`\n{keyword('white') Verificando comando} {keyword('dimgray') ${pasta}/${arquivo}}`);
            const comando = require(__dirname + `/comandos/${pasta}/${arquivo}`);


            log("custom", chalk`${tab}{keyword('dimgray') Checando conflitos}`);

            //* Verificar se já existe um comando com esse nome
            if (comandos.some(cmd => cmd.sinonimos.includes(comando.nome))) {
                log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') O nome "${comando.nome}" já está registrado como um sinônimo de um comando}`), erros++;
            } else if (comandos.some(cmd => cmd.nome === comando.nome)) {
                log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Um comando com o nome "${comando.nome}" já está registrado}`), erros++;
            } else {
                log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Um comando com o nome "${comando.nome}" foi registrado}`), sucessos++;
            }

            //* Verificar se já existe algum sinônimo
            for (const sinonimo of comando.sinonimos) {
                if (comandos.some(cmd => cmd.sinonimos.includes(sinonimo))) {
                    log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Um comando com o sinônimo "${sinonimo}" já está registrado}`), erros++;
                } else if (comandos.some(cmd => cmd.nome === sinonimo)) {
                    log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') O sinônimo "${sinonimo}" já está registrado como o nome de um comando}`), erros++;
                } else {
                    log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Um comando com o sinônimo "${sinonimo}" foi registrado}`), sucessos++;
                }
            }


            log("custom", chalk`${tab}{keyword('dimgray') Checando formatação}`);

            //* Verificar formatação do nome
            if (/^[a-z0-9]{1,20}$/.test(comando.nome)) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') O nome "${comando.nome}" está com a formatação ideal}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') O nome "${comando.nome}" está fora da formatação ideal}`), erros++;

            //* Verificar formatação do nome
            for (const sinonimo of comando.sinonimos) {
                if (/^[a-zà-ú0-9]{1,20}$/.test(sinonimo)) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') O sinônimo "${sinonimo}" está com a formatação ideal}`), sucessos++;
                else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') O sinônimo "${sinonimo}" está fora da formatação ideal}`), erros++;
            }

            //* Verificar formatação da descrição
            if (/^.{1,100}$/.test(comando.descricao)) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') A descrição "${comando.descricao}" está com a formatação ideal}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') A descrição "${comando.descricao}" está fora da formatação ideal}`), erros++;

            //* Verificar formatação de exemplos
            if (/^.{1,1024}$/.test(comando.exemplos)) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Os exemplos "${comando.exemplos}" está com a formatação ideal}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Os exemplos "${comando.exemplos}" está fora da formatação ideal}`), erros++;


            log("custom", chalk`${tab}{keyword('dimgray') Checando tipos}`);

            //* Verificar tipo de nome
            if (typeof comando.nome === "string") log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') O nome do comando é uma String}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') O nome do comando precisa ser uma String}`), erros++;

            //* Verificar tipo de sinônimos
            if (Array.isArray(comando.sinonimos) || comando.sinonimos.some(s => typeof s === "string")) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Os sinônimos do comando é uma Array de Strings}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Os sinônimos do comando precisa ser uma Array de Strings}`), erros++;

            //* Verificar tipo de descrição
            if (typeof comando.descricao === "string") log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') A descrição do comando é uma String}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') A descrição do comando precisa ser uma String}`), erros++;

            //? Mudar exemplos para String
            //* Verificar tipo de exemplos
            if (Array.isArray(comando.exemplos) || comando.sinonimos.some(s => typeof s === "string")) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Os exemplos do comando é uma Array de Strings}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Os exemplos do comando precisa ser uma Array de Strings}`), erros++;


            log("custom", chalk`${tab}{keyword('dimgray') Checando se comando está escondido}`);

            //* Verificar se nenhum comando, que não seja de dono, está escondido
            if (pasta === "dono" ? comando.escondido === true : comando.escondido === false) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') Comando não é de "dono" e não está escondido ou comando é de "dono" e está escondido}`), sucessos++;
            else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') Comando não é de "dono" e está escondido ou comando é de "dono" e não está escondido}`), erros++;


            log("custom", chalk`${tab}{keyword('dimgray') Checando perms}`);

            //* Verificar permissões
            let perms = []
            perms = perms.concat(comando.permissoes.usuario, comando.permissoes.bot);
            if (perms.length === 0) log("custom", chalk`${tab}${tab}{bgKeyword('silver').black IGNO} {keyword('silver') Nenhuma permissão}`), ignorados++;
            for (const perm of perms) {
                if (permsTraduzidas.includes(perm)) log("custom", chalk`${tab}${tab}{bgKeyword('lime').black PASS} {keyword('white') A permissão "${perm}" existe}`), sucessos++;
                else log("custom", chalk`${tab}${tab}{bgKeyword('red').black FAIL} {keyword('maroon') A permissão "${perm}" não existe}`), erros++;
            }


            comandos.push(comando);
        } catch (err) {
            erros++
            log("custom", chalk`${tab}{bgKeyword('red').black ERRO} {keyword('maroon') ${err.stack}}`)
        }
    }
}

log("custom", chalk`\n{keyword('white') Um total de ${erros + sucessos} testes foram feitos em ${new Date().getTime() - inicio.getTime()}ms}, {keyword('red') ${erros} falharam}, {keyword('lime') ${sucessos} passaram}, {keyword('silver') ${ignorados} ignorados}`);

if (erros > 0) process.exitCode = 1;


// module.exports("custom", chalk`{bgKeyword('lime').black PASS} {keyword('silver') teste foda}`);
// module.exports("custom", chalk`{bgKeyword('red').black FAIL} {keyword('silver') teste foda}`);
// module.exports("custom", chalk`Testes: {keyword('red') 1 falharam}, {keyword('lime') 1 passaram}, 2 total`);
// module.exports("custom", chalk`Resultado: {bgKeyword('red').black FAIL}`);
// module.exports("custom", chalk`Resultado: {bgKeyword('lime').black PASS}`);

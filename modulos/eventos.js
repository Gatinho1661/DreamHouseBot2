const fs = require("fs");

module.exports = () => {
    for (const arquivo of fs.readdirSync(client.dir + `/eventos/`)) {
        if (!arquivo.endsWith(".js")) continue

        try {
            //  client.log("verbose", `Carregando evento ${arquivo}...`)
            const evento = require(client.dir + `/eventos/${arquivo}`);

            if (evento.once) {
                client.once(evento.nome, (...args) => evento.executar(...args));
            } else {
                client.on(evento.nome, (...args) => evento.executar(...args));
            }

            client.log("verbose", `Evento carregado ${evento.nome}`)
        } catch (err) {
            client.log("critico", err.stack)
        }
    }
}
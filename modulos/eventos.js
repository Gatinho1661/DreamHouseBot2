const fs = require("fs");

module.exports = (client) => {
    let eventos = []
    for (const arquivo of fs.readdirSync(client.dir + `/eventos/`)) {
        if (!arquivo.endsWith(".js")) continue
        client.log("verbose", `Carregando evento ${arquivo}...`)
        const evento = require(client.dir + `/eventos/${arquivo}`);
        let nomeEvento = arquivo.split(".")[0];

        eventos.push(nomeEvento)

        client.on(nomeEvento, evento.bind(null, client));
        client.log("verbose", `Evento carregado ${nomeEvento}`)
    };
}
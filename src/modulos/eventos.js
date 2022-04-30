const fg = require("fast-glob");

module.exports = () => {
    for (const arquivo of fg.sync(`*.js`, { cwd: client.dir + "/eventos", baseNameMatch: true })) {
        try {
            //client.log("verbose", `Carregando evento ${arquivo}...`)
            const evento = require(client.dir + `/eventos/${arquivo}`);

            if (!evento) throw new Error("Evento não definido");
            if (!evento.nome) throw new Error("Nome do evento não definido");
            if (typeof evento.once === "undefined") throw new Error("Once do evento não definido");
            if (!evento.origem) throw new Error("Origem do evento não definido");

            // Ouvir eventos da origem
            evento.origem[evento.once ? "once" : "on"](evento.nome, (...args) => evento.executar(...args));

            client.log("verbose", `Evento foi carregado: ${evento.nome}`);
        } catch (err) {
            client.log("critico", `O evento "${arquivo}" será ignorado\n${err.stack}`);
        }
    }
}
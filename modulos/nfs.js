const Enmap = require("enmap");

exports.iniciar = function (msg, participantesMsg, cargo) {
    client.nfs = new Enmap("nfs");
    client.config.set("nfs", true);

    client.nfs.ensure("msgId", participantesMsg.id);
    client.nfs.ensure("canal", msg.channel.id);
    client.nfs.ensure("cargo", cargo.id);
    client.nfs.ensure("participantes", [
        {
            id: "54654445546",
            status: "ganhador",
            perdeuEm: null
        } //? isso vai sair
    ]);
    client.nfs.ensure("resultados", [{ ganhadores: [], perdedores: [] }]);
}
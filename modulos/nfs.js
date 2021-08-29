const Enmap = require("enmap");

exports.iniciar = function (msg, participantesMsg, cargo) {
    client.nfs = new Enmap("nfs");
    client.config.set("nfs", true);

    client.nfs.set("msgId", participantesMsg.id);
    client.nfs.set("canal", msg.channel.id);
    client.nfs.set("cargo", cargo.id);
    client.nfs.set("participantes", []);
    //client.nfs.set("resultados", [{ ganhadores: [], perdedores: [] }]);
    client.nfs.set("checks", []);
}
exports.check = function (checkMsg, dia) {
    const checks = client.nfs.get("checks") || [];
    checks[dia.getDate() - 1] = {
        dia: `${dia.getDate()}`,
        id: checkMsg.id,
        ganhadores: [],
        perdedores: [],
    };
    client.nfs.set("checks", checks);
}
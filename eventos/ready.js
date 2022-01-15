
const nfsCheckar = require("./../temporizadores/nfsCheckar");
const salvarMsgs = require("../modulos/salvarMsgs");
const aniversarios = require("./../temporizadores/aniversarios");


// Emitido quando o bot fica pronto
module.exports = {
    nome: "ready",
    once: true, // Se deve ser executado apenas uma vez

    async executar() {
        client.log("bot", `Iniciado em ${client.user.tag} (${client.user.id})`);

        // Dar fetch na aplicação do bot
        await client.application.fetch();

        client.log("bot", `Bom dia ${client.application.owner.username}`)

        if (client.config.get("salvarMsgs") === true) client.log("bot", "Modulo de Salvar Mensagens ativado"), salvarMsgs();
        else client.log("bot", "Modulo de Salvar mensagens desativado", "aviso");

        if (client.config.get("aniversarios", "ativado") === true) client.log("bot", "Modulo de Aniversários ativado"), aniversarios();
        else client.log("bot", "Modulo de aniversários desativado", "aviso");

        if (client.nfs.get("ligado") === true) client.log("bot", "Evento NFS ativado"), nfsCheckar();
        else client.log("bot", "Evento NFS desativado", "aviso");
    }
}
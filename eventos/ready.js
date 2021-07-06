// Emitido quando o bot fica pronto
module.exports = {
    nome: "ready",
    once: true, // Se deve ser executado apenas uma vez

    async executar() {
        client.log("bot", `${client.user.tag} pronto!`);
    }
}
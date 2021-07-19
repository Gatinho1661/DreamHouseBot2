// Emitido quando o bot fica pronto
module.exports = {
    nome: "rateLimit",
    once: false, // Se deve ser executado apenas uma vez

    async executar(rateLimitInfo) {
        client.log(rateLimitInfo.global ? "erro" : "aviso", `Rate Limit - ${rateLimitInfo.timeout}ms em ${rateLimitInfo.method} ${rateLimitInfo.path}`);
    }
}
// Emitido quando o usuário é respondido por uma mensagem
module.exports = async (excTempo, cmd) => { //msg, args
    client.log("comando", `${client.commandPrefix}${cmd.name} foi respondido em ${(new Date().getTime() - excTempo.getTime())}ms`);
}
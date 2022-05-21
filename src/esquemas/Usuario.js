/* eslint-disable new-cap */
/* eslint-disable camelcase */
const mongoose = require("mongoose");

module.exports = () => {

  const relacao = new mongoose.Schema(
    {
      id_conjuge: { type: mongoose.SchemaTypes.ObjectId, default: null, ref: "Usuario" },
      nome_conjuge: { type: String, default: null },
      data_casamento: { type: Date, default: null },
      amantes: [{ type: mongoose.SchemaTypes.ObjectId, default: null, ref: "Usuario" }],
    },
    {
      _id: false,
      toObject: { virtuals: true },
      toJSON: { virtuals: true }
    }
  );

  const usuario = new mongoose.Schema(
    {
      _id: { type: mongoose.SchemaTypes.ObjectId, default: mongoose.Types.ObjectId() },
      __metadados: {},
      contas: [String],
      nome: { type: String, default: null, required: true },
      data_nascimento: { type: Date, default: null },
      idade: { type: Number, default: null },
      orientacao: { type: String, default: null },
      pronomes: [String],
      relacao: { type: relacao, default: () => ({}) },
    },
    {
      minimize: false,
      optimisticConcurrency: true,
      versionKey: "__metadados.versao",
      timestamps: { createdAt: "__metadados.criado_em", updatedAt: "__metadados.atualizado_em" }
    }
  );

  usuario.index({ "contas": 1 }, { unique: true });

  relacao.virtual("conjuge", {
    ref: "Usuario",
    localField: "id_conjuge",
    foreignField: "_id",
    justOne: true
  });

  usuario.virtual("contaPrincipal")
    .get(function () {
      return this.contas[0];
    })
    .set(function (contaId) {
      if (this.contas.includes(contaId)) {
        // Mover conta para o inicio da array
        const contas = this.contas.filter(c => c !== contaId);
        contas.unshift(contaId);

        this.contas = contas;
      } else {
        // Adicionar conta no inicio da array
        this.contas.unshift(contaId);
      }
    });

  relacao.methods.casar = async function (conjuge) {
    //TODO Remover de amantes se tiver
    const dataCasamento = new Date();

    this.relacao.id_conjuge = mongoose.Types.ObjectId(conjuge.id);
    this.relacao.nome_conjuge = conjuge.nome;
    this.relacao.data_casamento = dataCasamento;

    console.log(this.relacao);

    conjuge.relacao.id_conjuge = mongoose.Types.ObjectId(this.id);
    conjuge.relacao.nome_conjuge = this.nome;
    conjuge.relacao.data_casamento = dataCasamento;

    console.log(conjuge.relacao);

    return this.bulkSave([this, conjuge]);
  };

  return mongoose.model("Usuario", usuario);
};
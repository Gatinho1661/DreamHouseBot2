/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
const mongoose = require("mongoose");

module.exports = () => {

  const conta = new mongoose.Schema({
    _id: String,
    nome: String,
    primaria: Boolean
  });

  const relacao = new mongoose.Schema(
    {
      //_id: mongoose.SchemaTypes.ObjectId,
      _id_conjuge: { type: mongoose.SchemaTypes.ObjectId, default: null },
      nome_conjuge: { type: String, default: null },
      data_casamento: { type: Date, default: null },
      amantes: [{ type: mongoose.SchemaTypes.ObjectId, default: null }],
    },
    { _id: false }
  );

  const usuario = new mongoose.Schema(
    {
      _id: { type: mongoose.SchemaTypes.ObjectId, default: mongoose.Types.ObjectId() },
      __metadados: {},
      nome: { type: String, default: null, required: true },
      data_nascimento: { type: Date, default: null },
      idade: { type: Number, default: null },
      orientacao: { type: String, default: null },
      pronome: {
        primario: { type: String, default: null },
        ele: { type: Boolean, default: false },
        ela: { type: Boolean, default: false },
        elu: { type: Boolean, default: false },
      },
      relacao: { type: relacao, default: () => ({}) },
      contas: [conta],
    },
    {
      minimize: false,
      optimisticConcurrency: true,
      versionKey: "__metadados.versao",
      timestamps: { createdAt: "__metadados.criado_em", updatedAt: "__metadados.atualizado_em" }
    }
  );

  usuario.index({ "contas._id": 1 }, { unique: true });

  usuario.methods.obterContaPrimaria = function () {
    const posicao = this.contas.find((conta) => conta.primaria);
    return this.contas[posicao];
  };

  usuario.methods.adicionarConta = function (id, nome) {
    console.log("Adicionando conta para:", nome);

    let primaria = true;
    if (this.obterContaPrimaria()) primaria = false;

    const conta = {
      _id: id,
      nome,
      primaria
    };

    this.contas.push(conta);

    console.log(this);

    return this;
  };

  relacao.methods.casar = async function (conjuge) {
    //TODO Remover de amantes se tiver
    const dataCasamento = new Date();

    this.relacao._id_conjuge = mongoose.Types.ObjectId(conjuge._id);
    this.relacao.nome_conjuge = conjuge.nome;
    this.relacao.data_casamento = dataCasamento;

    console.log(this.relacao);

    conjuge.relacao._id_conjuge = mongoose.Types.ObjectId(this._id);
    conjuge.relacao.nome_conjuge = this.nome;
    conjuge.relacao.data_casamento = dataCasamento;

    console.log(conjuge.relacao);

    return this.bulkSave([this, conjuge]);
  };

  return mongoose.model("Usuario", usuario);
};
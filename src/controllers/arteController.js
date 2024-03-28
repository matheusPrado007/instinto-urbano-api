"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = exports.remove = exports.update = exports.create = void 0;
const Arte_1 = __importDefault(require("../models/Arte"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, nome_artista, nome, uf, cidade, descricao, endereco } = req.body;
        const nomeDoArquivoFirebase = req.file;
        console.log(nomeDoArquivoFirebase.firebaseUrl);
        if (!nomeDoArquivoFirebase.firebaseUrl) {
            return res.status(400).json({ message: "Nenhuma imagem foi enviada." });
        }
        const arte = new Arte_1.default({
            username,
            nome_artista,
            nome,
            foto: nomeDoArquivoFirebase.firebaseUrl,
            descricao,
            uf,
            cidade,
            endereco,
        });
        yield arte.save();
        res.status(201).json(arte);
    }
    catch (err) {
        res.status(500).json({ message: "Erro interno ao salvar a imagem." });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arteId = req.params.id;
        if (!arteId) {
            return res.status(404).json({ message: "id de params não informado" });
        }
        const arte = yield Arte_1.default.findById(arteId);
        if (!arte) {
            return res.status(404).json({ message: "Arte não encontrada" });
        }
        if (req.body.nomeFoto) {
            yield (0, uploadMiddleware_1.deleteFromStorage)(arte.foto);
            arte.foto = req.body.nomeFoto;
            yield arte.save();
            return res.json({ message: "Imagem atualizada com sucesso" });
        }
        const camposAtualizados = ["nome_artista", "nome", "uf", "cidade", "descricao", "endereco", "username"];
        camposAtualizados.forEach((campo) => {
            if (req.body[campo]) {
                arte[campo] = req.body[campo];
            }
        });
        yield arte.save();
        res.json({ message: "Update realizado" });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao atualizar a imagem" });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arteId = req.params.id;
        const arte = yield Arte_1.default.findById(arteId);
        if (!arte) {
            return res.status(404).json({ message: "Arte não encontrada" });
        }
        // Excluir a imagem do Firebase Storage
        yield (0, uploadMiddleware_1.deleteFromStorage)(arte.foto);
        // Remover a arte do banco de dados
        yield arte.remove();
        res.json({ message: "Arte removida com sucesso" });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao remover a Arte" });
    }
});
exports.remove = remove;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arte = yield Arte_1.default.find();
        res.json(arte);
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar as artes." });
    }
});
exports.findAll = findAll;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ArteSchema = new Schema({
    username: { type: String, required: true },
    nome_artista: { type: String, required: true },
    nome: { type: String, required: true },
    foto: { type: String, required: true },
    descricao: { type: String, required: true },
    uf: { type: String, required: true },
    cidade: { type: String, required: true },
    endereco: { type: String, required: true },
});
exports.default = mongoose_1.default.model('Arte', ArteSchema);

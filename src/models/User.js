"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const UserSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    descricao_perfil: { type: String, required: true },
    foto_perfil: { type: String, required: true },
    foto_capa: { type: String, required: false },
    linkedin: { type: String, required: false },
    instagram: { type: String, required: false },
    administrador: { type: Boolean, required: true },
    descricao_curta: { type: String, required: true, maxlength: 100 }
});
exports.default = mongoose_1.default.model("User", UserSchema);

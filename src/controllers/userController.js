"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loginPost = exports.findAll = exports.remove = exports.update = exports.create = void 0;
const bcrypt = __importStar(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const jwtService_1 = require("../auth/jwtService");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, senha, descricao_perfil, nomeArquivoPerfil, nomeArquivoCapa, linkedin, instagram, administrador, descricao_curta } = req.body;
        if (!nomeArquivoPerfil || !nomeArquivoCapa) {
            return res.status(400).json({ message: 'Nomes dos arquivos não fornecidos.' });
        }
        const hashedSenha = yield bcrypt.hash(senha, 10);
        const user = new User_1.default({
            name,
            username,
            email,
            senha: hashedSenha,
            descricao_perfil,
            foto_perfil: nomeArquivoPerfil,
            foto_capa: nomeArquivoCapa,
            linkedin,
            instagram,
            administrador,
            descricao_curta
        });
        console.log('Usuário criado:', user);
        yield user.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Erro interno ao salvar as imagens.' });
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const files = req.files;
        if (files) {
            Object.keys(files).forEach((fieldname) => {
                const imagem = files[fieldname][0];
                if (fieldname === 'foto_perfil') {
                    (0, uploadMiddleware_1.deleteFromStorage)(user.foto_perfil);
                    user.foto_perfil = req.body.nomeArquivoPerfil;
                }
                else if (fieldname === 'foto_capa') {
                    (0, uploadMiddleware_1.deleteFromStorage)(user.foto_capa);
                    user.foto_capa = req.body.nomeArquivoCapa;
                }
            });
        }
        const camposAtualizados = [
            'username', 'email', 'senha', 'descricao_perfil',
            'linkedin', 'instagram', 'administrador', 'descricao_curta', 'name'
        ];
        yield Promise.all(camposAtualizados.map((campo) => __awaiter(void 0, void 0, void 0, function* () {
            if (campo === 'senha' && req.body[campo]) {
                const hashedSenha = yield bcrypt.hash(req.body[campo], 10);
                user[campo] = hashedSenha;
            }
            else if (req.body[campo] !== undefined) {
                user[campo] = req.body[campo];
            }
        })));
        yield user.save();
        res.json({ message: 'Usuário atualizado com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar o usuário' });
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        yield (0, uploadMiddleware_1.deleteFromStorage)(user.foto_perfil);
        yield (0, uploadMiddleware_1.deleteFromStorage)(user.foto_capa);
        yield user.remove();
        res.json({ message: 'Usuário removido com sucesso' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao remover o usuário' });
    }
});
exports.remove = remove;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao buscar os usuários.' });
    }
});
exports.findAll = findAll;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas. Usuário não encontrado.' });
        }
        if (typeof user.senha !== 'string') {
            return res.status(401).json({ message: 'Credenciais inválidas. Tipo de senha inválido.' });
        }
        const senhaValida = yield bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Credenciais inválidas. Senha incorreta.' });
        }
        // Gera token de acesso e token de atualização
        const { accessToken, refreshToken } = (0, jwtService_1.generateTokens)(user._id);
        res.status(201).json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor durante o login.' });
    }
});
exports.loginPost = loginPost;

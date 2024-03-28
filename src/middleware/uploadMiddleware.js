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
exports.deleteFromStorage = exports.updateToStorageMultiple = exports.multipleUploadStorage = exports.uploadToStorage = exports.singleUpload = void 0;
const uuid_1 = require("uuid");
const firebase_1 = __importDefault(require("../firebase"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
// Criação de Imagem
exports.singleUpload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (request, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('O arquivo enviado não é uma imagem.'));
        }
    },
}).single('imagem');
const uploadToStorage = (request, response, next) => {
    try {
        if (!request.file) {
            next();
            return;
        }
        const imagem = request.file;
        const nomeFoto = `${(0, uuid_1.v4)()}.jpg`;
        const file = firebase_1.default.file(nomeFoto);
        const stream = file.createWriteStream({
            metadata: {
                contentType: imagem.mimetype,
            },
        });
        stream.on('error', (e) => {
            console.log(e);
            next(e);
        });
        stream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            yield file.makePublic();
            imagem.firebaseUrl = `https://storage.googleapis.com/${firebase_1.default.name}/${nomeFoto}`;
            console.log('URL do Firebase:', imagem.firebaseUrl);
            next();
        }));
        stream.end(imagem.buffer);
    }
    catch (error) {
        response.status(500).json({ message: 'Erro ao fazer upload da imagem para o Firebase Storage' });
    }
};
exports.uploadToStorage = uploadToStorage;
exports.multipleUploadStorage = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (request, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('O arquivo enviado não é uma imagem.'));
        }
    },
}).fields([
    { name: 'foto_perfil', maxCount: 1 },
    { name: 'foto_capa', maxCount: 1 },
]);
const updateToStorageMultiple = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.files || request.files.length === 0) {
            return next();
        }
        const files = request.files;
        // Verifique e processe foto_perfil
        if (files['foto_perfil']) {
            const imagemPerfil = files['foto_perfil'][0];
            const nomeArquivoPerfil = `${(0, uuid_1.v4)()}.jpg`;
            const filePerfil = firebase_1.default.file(nomeArquivoPerfil);
            const streamPerfil = filePerfil.createWriteStream({
                metadata: {
                    contentType: imagemPerfil.mimetype,
                },
            });
            streamPerfil.on('error', (e) => {
                console.log(e);
                next(e);
            });
            streamPerfil.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
                yield filePerfil.makePublic();
                imagemPerfil.firebaseUrl = `https://storage.googleapis.com/${firebase_1.default.name}/${nomeArquivoPerfil}`;
            }));
            request.body.nomeArquivoPerfil = `https://storage.googleapis.com/${firebase_1.default.name}/${nomeArquivoPerfil}`;
            ;
            streamPerfil.end(imagemPerfil.buffer);
        }
        if (files['foto_capa']) {
            const imagemCapa = files['foto_capa'][0];
            const nomeArquivoCapa = `${(0, uuid_1.v4)()}.jpg`;
            const fileCapa = firebase_1.default.file(nomeArquivoCapa);
            const streamCapa = fileCapa.createWriteStream({
                metadata: {
                    contentType: imagemCapa.mimetype,
                },
            });
            streamCapa.on('error', (e) => {
                console.log(e);
                next(e);
            });
            streamCapa.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
                yield fileCapa.makePublic();
                imagemCapa.firebaseUrl = `https://storage.googleapis.com/${firebase_1.default.name}/${nomeArquivoCapa}`;
            }));
            request.body.nomeArquivoCapa = `https://storage.googleapis.com/${firebase_1.default.name}/${nomeArquivoCapa}`;
            streamCapa.end(imagemCapa.buffer);
        }
        next();
    }
    catch (error) {
        response.status(500).json({ message: 'Erro ao fazer upload das imagens para o Firebase Storage' });
    }
});
exports.updateToStorageMultiple = updateToStorageMultiple;
// Exclusão de Imagem
const deleteFromStorage = (nomeArquivo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (nomeArquivo === undefined) {
            console.log('Nome de arquivo não fornecido. Nada será excluído.');
            return;
        }
        const firebaseNome = nomeArquivo.split('/').find((item) => item.includes('jpg'));
        const file = firebase_1.default.file(firebaseNome);
        const [exists] = yield file.exists();
        if (exists) {
            yield file.delete();
            console.log(`Arquivo ${nomeArquivo} excluído do Firebase Storage`);
        }
        else {
            console.log(`Arquivo ${nomeArquivo} não encontrado no Firebase Storage`);
        }
    }
    catch (error) {
        console.error(`Erro ao excluir o arquivo ${nomeArquivo} do Firebase Storage:`, error);
        throw error;
    }
});
exports.deleteFromStorage = deleteFromStorage;

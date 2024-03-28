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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtService_1 = require("../auth/jwtService");
const jwtService_2 = require("../auth/jwtService"); // Importe a função generateTokens
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        console.error('Token não fornecido.');
        return res.status(401).send('Access denied.');
    }
    try {
        let decoded;
        if (token.startsWith('Bearer ')) {
            const accessToken = token.slice(7);
            decoded = (0, jwtService_1.verifyAccessToken)(accessToken);
        }
        else {
            decoded = (0, jwtService_1.verifyRefreshToken)(token);
            const newTokens = (0, jwtService_2.generateTokens)(decoded.userId);
            res.locals.newTokens = newTokens;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(400).send(`Token inválido. Detalhes: ${error.message}`);
    }
});
exports.authenticateToken = authenticateToken;

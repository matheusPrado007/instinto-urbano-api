"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const api_rastro_urbano_json_1 = __importDefault(require("../config/api-rastro-urbano.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(api_rastro_urbano_json_1.default),
    storageBucket: 'gs://rastro-urbano.appspot.com', // Substitua pelo nome do seu bucket de armazenamento
});
const bucket = firebase_admin_1.default.storage().bucket();
exports.default = bucket;

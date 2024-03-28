"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const arteController_1 = require("../controllers/arteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Rota de upload de imagem
router.post('/createArte', authMiddleware_1.authenticateToken, uploadMiddleware_1.singleUpload, uploadMiddleware_1.uploadToStorage, arteController_1.create);
router.get('/artes', arteController_1.findAll);
router.put('/updatearte/:id', authMiddleware_1.authenticateToken, uploadMiddleware_1.singleUpload, uploadMiddleware_1.uploadToStorage, arteController_1.update);
router.delete('/deletearte/:id', authMiddleware_1.authenticateToken, arteController_1.remove);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const userController_1 = require("../controllers/userController");
const routerUser = express_1.default.Router();
routerUser.post('/login', userController_1.loginPost);
// Rota de upload de imagem
routerUser.post('/createUser', uploadMiddleware_1.multipleUploadStorage, uploadMiddleware_1.updateToStorageMultiple, userController_1.create);
routerUser.get('/users', userController_1.findAll);
routerUser.put('/updateUser/:id', uploadMiddleware_1.multipleUploadStorage, uploadMiddleware_1.updateToStorageMultiple, userController_1.update);
routerUser.delete('/deleteuser/:id', userController_1.remove);
exports.default = routerUser;

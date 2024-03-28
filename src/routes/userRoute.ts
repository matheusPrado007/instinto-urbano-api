import express from 'express';
import { updateToStorageMultiple, multipleUploadStorage } from '../middleware/uploadMiddleware';
import { create, findAll, remove, update, loginPost } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const routerUser = express.Router();

routerUser.post('/login', loginPost);
// Rota de upload de imagem
routerUser.post('/createUser', multipleUploadStorage, updateToStorageMultiple, create);

routerUser.get('/users', findAll);

routerUser.put('/updateUser/:id', multipleUploadStorage, updateToStorageMultiple, update);

routerUser.delete('/deleteuser/:id', remove);

export default routerUser;

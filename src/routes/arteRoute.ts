import express from 'express';
import { singleUpload, uploadToStorage } from '../middleware/uploadMiddleware';
import { create, findAll, remove, update } from '../controllers/arteController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Rota de upload de imagem
router.post('/createArte', authenticateToken, singleUpload, uploadToStorage, create);

router.get('/artes', findAll);

router.put('/updatearte/:id', authenticateToken, singleUpload, uploadToStorage, update);

router.delete('/deletearte/:id', authenticateToken, remove);

export default router;

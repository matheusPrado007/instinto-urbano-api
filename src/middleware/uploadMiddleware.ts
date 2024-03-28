import { v4 as uuidv4 } from 'uuid';
import buckt from '../firebase';
import { Request, Response, NextFunction } from 'express';

import multer from 'multer';
const storage = multer.memoryStorage();

// Criação de Imagem
export const singleUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (request: Request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('O arquivo enviado não é uma imagem.'));
    }
  },
}).single('imagem');


export const uploadToStorage = (request: Request, response: Response, next: NextFunction) => {
  try {

    if (!request.file) {
      next()
      return;
    }

    const imagem: any = request.file;

    const nomeFoto = `${uuidv4()}.jpg`;

    const file = buckt.file(nomeFoto);

    const stream = file.createWriteStream({
      metadata: {
        contentType: imagem.mimetype,
      },
    });

    stream.on('error', (e) => {
      console.log(e);
      next(e);
    });

    stream.on('finish', async () => {
      await file.makePublic();

       imagem.firebaseUrl = `https://storage.googleapis.com/${buckt.name}/${nomeFoto}`;
       console.log('URL do Firebase:', imagem.firebaseUrl); 

      next();
    });

    stream.end(imagem.buffer);
  } catch (error) {
    response.status(500).json({ message: 'Erro ao fazer upload da imagem para o Firebase Storage' });
  }
};

export const multipleUploadStorage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (request: Request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('O arquivo enviado não é uma imagem.'));
    }
  },
}).fields([
  { name: 'foto_perfil', maxCount: 1 },
  { name: 'foto_capa', maxCount: 1 },
]);

export const updateToStorageMultiple = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.files || request.files.length === 0) {
      return next();
    }

    const files: any = request.files;

    // Verifique e processe foto_perfil
    if (files['foto_perfil']) {
      const imagemPerfil = files['foto_perfil'][0];
      const nomeArquivoPerfil = `${uuidv4()}.jpg`;
      
      const filePerfil = buckt.file(nomeArquivoPerfil);
      const streamPerfil = filePerfil.createWriteStream({
        metadata: {
          contentType: imagemPerfil.mimetype,
        },
      });

      streamPerfil.on('error', (e) => {
        console.log(e);
        next(e);
      });
      
      streamPerfil.on('finish', async () => {
        await filePerfil.makePublic();
        imagemPerfil.firebaseUrl = `https://storage.googleapis.com/${buckt.name}/${nomeArquivoPerfil}`;
      });
      
      
      request.body.nomeArquivoPerfil = `https://storage.googleapis.com/${buckt.name}/${nomeArquivoPerfil}`; ;
      streamPerfil.end(imagemPerfil.buffer);
    }

    if (files['foto_capa']) {
      const imagemCapa = files['foto_capa'][0];
      const nomeArquivoCapa = `${uuidv4()}.jpg`;

      
      const fileCapa = buckt.file(nomeArquivoCapa);
      const streamCapa = fileCapa.createWriteStream({
        metadata: {
          contentType: imagemCapa.mimetype,
        },
      });

      streamCapa.on('error', (e) => {
        console.log(e);
        next(e);
      });
      
      streamCapa.on('finish', async () => {
        await fileCapa.makePublic();
        imagemCapa.firebaseUrl = `https://storage.googleapis.com/${buckt.name}/${nomeArquivoCapa}`;
      });
      
      request.body.nomeArquivoCapa = `https://storage.googleapis.com/${buckt.name}/${nomeArquivoCapa}`;
      streamCapa.end(imagemCapa.buffer);
    }

    next();
  } catch (error) {
    response.status(500).json({ message: 'Erro ao fazer upload das imagens para o Firebase Storage' });
  }
};

// Exclusão de Imagem
export const deleteFromStorage = async (nomeArquivo: string | undefined) => {
  try {
    if (nomeArquivo === undefined) {
      console.log('Nome de arquivo não fornecido. Nada será excluído.');
      return;
    }
    const firebaseNome: any = nomeArquivo.split('/').find((item) => item.includes('jpg'))
    
    const file = buckt.file(firebaseNome);
    
    
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`Arquivo ${nomeArquivo} excluído do Firebase Storage`);
    } else {
      console.log(`Arquivo ${nomeArquivo} não encontrado no Firebase Storage`);
    }
  } catch (error) {
    console.error(`Erro ao excluir o arquivo ${nomeArquivo} do Firebase Storage:`, error);
    throw error;
  }
};

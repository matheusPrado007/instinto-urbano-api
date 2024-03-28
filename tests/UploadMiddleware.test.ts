import { Request, Response, NextFunction } from 'express';
import {
    uploadToStorage, updateToStorage,
    updateToStorageMultiple, uploadToStorageMultiple
} from './../src/middleware/uploadMiddleware';
import { authenticateToken } from '../src/middleware/authMiddleware';


interface ExtendedFile extends Express.Multer.File {
    firebaseUrl?: string;
}

describe('uploadToStorage', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    beforeEach(() => {
        req = {} as Request;
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });

    it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = 'Erro ao fazer upload da imagem para o Firebase Storage';

        await updateToStorage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    }, 100000);

    it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = 'Erro ao fazer upload da imagem para o Firebase Storage';

        await uploadToStorage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    }, 100000);


    it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = 'Erro ao fazer upload das imagens para o Firebase Storage';

        await updateToStorageMultiple(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    }, 100000);

    it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = 'Nenhuma imagem foi enviada.';

        await uploadToStorageMultiple(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    }, 100000);
});


describe('authenticateToken', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    beforeEach(() => {
        req = {
            header: jest.fn(),
        } as unknown as Request;
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });
    const mockRequest = {
        header: jest.fn(),
      } as any;
      
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as any;

    const mockNext = jest.fn();

    it('Deve retornar status 401 se o token não for fornecido', async () => {
        

        mockRequest.header.mockReturnValue(undefined);

        await authenticateToken(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
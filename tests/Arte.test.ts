import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { create, update, remove, findAll } from './../src/controllers/arteController';
import Arte from '../src/models/Arte';


jest.mock('bcrypt');

let req: Partial<Request>;
let res: Partial<Response>;

beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
});

const mockResponse = (): Response => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

describe('Arte Controller - create', () => {
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
    it('Deve criar uma arte com sucesso', async () => {

        req.body = {
            nome_artista: 'h.p.lovecract',
            nome: 'call of cthulhu',
            nomeFoto: 'arte.jpg',
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
        };

        jest.spyOn(Arte.prototype, 'save').mockResolvedValueOnce({ _id: 'someId', ...req.body } as any);

        await create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nome_artista: 'h.p.lovecract' }));
    });

    it('Deve retornar um erro se os nomes dos arquivos não forem fornecidos', async () => {
        // Não simule o nome do arquivo para provocar um erro
        req.body = {
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
        };

        await create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma imagem foi enviada.' });
    });
    it('deve lidar com erros ao remover usuario', async () => {
        const errorMessage = "Erro interno ao salvar a imagem.";
  
        await create(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      }, 100000);
});

describe('Arte Controller - update', () => {
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

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve atualizar um usuário com sucesso', async () => {
        jest.spyOn(Arte, 'findById').mockResolvedValueOnce({
            _id: "someId",
            nome_artista: 'h.p.lovecract',
            nome: 'call of cthulhu',
            foto: 'arte.jpg',
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
            save: jest.fn(),
        } as any);

        const req = { params: { id: 'someId' } } as unknown as Request;

        req.body = {
            nome_artista: 'h.p',
            nome: 'Montanhas da Loucura',
        };


        await update(req as Request, res as Response);


        expect(res.json).toHaveBeenCalledWith({ message: "Update realizado" });
    });


    it('deve retornar um erro se o usuário não for encontrado', async () => {
        // Simulando User.findById para retornar null
        jest.spyOn(Arte, 'findById').mockResolvedValueOnce(null);

        const req = { params: { id: 'someId' } } as unknown as Request;
        await update(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Arte não encontrada" });
    });


    it('deve lidar com atualizações de dados', async () => {
        jest.spyOn(Arte, 'findById').mockResolvedValueOnce({
            _id: "someId",
            nome_artista: 'h.p.lovecract',
            nome: 'call of cthulhu',
            foto: 'arte.jpg',
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
            save: jest.fn(),
        } as any);

        const req = { params: { id: 'someId' } } as unknown as Request;
        req.body = {
            username: 'updatedUser',
        };

        await update(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith({ message: "Update realizado" });
    });

    it('deve lidar com id inexistente', async () => {
        jest.spyOn(Arte, 'findById').mockResolvedValueOnce(null);
        const req = { params: { id: 'someId' } } as unknown as Request;

        await update(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith({ message: 'Arte não encontrada' });
    });

    it('deve lidar com atualizações de arquivos', async () => {
        jest.spyOn(Arte, 'findById').mockResolvedValueOnce({
            _id: "someId",
            nome_artista: 'h.p.lovecract',
            nome: 'call of cthulhu',
            foto: 'arte.jpg',
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
            save: jest.fn(),
        } as any);

        const req = { params: { id: 'someId' } } as unknown as Request;
        req.body = {
            nomeFoto: 'foto',
        };

        await update(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith({ message: "Imagem atualizada com sucesso" });
    });

    it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = "Erro ao atualizar a imagem";
        const req = { params: { id: 'someId' } } as unknown as Request;

        await update(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      }, 100000);

      it('deve lidar com erros ao atualizar usuario', async () => {
        const errorMessage = "id de params não informado";
        const req = { params: { id: undefined } } as unknown as Request;

        await update(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
      }, 100000);
});

describe('Arte Controller - remove', () => {
    jest.mock('../src/models/Arte');
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {} as Request;
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
    });


    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve remover arquivos', async () => {

        const arte = {
            _id: "someId",
            nome_artista: 'h.p.lovecract',
            nome: 'call of cthulhu',
            foto: 'arte.jpg',
            descricao: 'livro do lovecraft',
            uf: 'state',
            cidade: 'state',
            endereco: 'state',
            save: jest.fn(),
            remove: jest.fn(),
        } as any;

        jest.spyOn(Arte, 'findById').mockResolvedValueOnce(arte);

        const res = mockResponse();
        const req = { params: { id: 'someId' } } as unknown as Request;

        await remove(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: "Arte removida com sucesso" });
    });

    it('deve retornar um erro se o usuário não for encontrado ao tentar remover', async () => {
      // Simulando User.findById para retornar null
      jest.spyOn(Arte, 'findById').mockResolvedValueOnce(null);
      const res = mockResponse();
      const req = { params: { id: 'someId' } } as unknown as Request;

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Arte não encontrada" });
    });

    it('deve lidar com erros ao remover usuario', async () => {
      const errorMessage = "Erro ao remover a Arte";

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

});

describe('Arte Controller - findAll', () => {
    let req: Request;
    let res: Response;
  
    beforeEach(() => {
      req = {} as Request;
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
    });
  
    it('deve retornar usuários corretamente', async () => {
      const mockArte = [{
        _id: "someId",
        nome_artista: 'h.p.lovecract',
        nome: 'call of cthulhu',
        foto: 'arte.jpg',
        descricao: 'livro do lovecraft',
        uf: 'state',
        cidade: 'state',
        endereco: 'state',
      }, {
        _id: "someId",
        nome_artista: 'h.p.lovecract',
        nome: 'Nas montanhas da loucura',
        foto: 'arte.jpg',
        descricao: 'livro do lovecraft',
        uf: 'state',
        cidade: 'state',
        endereco: 'state',
      }];
  
  
  
      jest.spyOn(Arte, 'find').mockResolvedValueOnce(mockArte);
  
      await findAll(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockArte);
    });
  
    it('deve lidar com erros ao buscar usuários', async () => {
      const errorMessage = "Erro ao buscar as artes.";
      (Arte.find as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
  
      await findAll(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    }, 100000);
  });
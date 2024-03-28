import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { create, update, remove, findAll, loginPost } from './../src/controllers/userController';
import User from '../src/models/User';
import ExtendedRequest from '../src/types/UserTypes';
import { deleteFromStorage } from '../src/middleware/uploadMiddleware';
import { generateTokens } from '../src/auth/jwtService';



jest.mock('bcrypt');

let req: Partial<Request>;
let res: Partial<Response>;
const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};


describe('User Controller - create', () => {
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


  it('Deve criar um usuário com sucesso', async () => {
    req.body = {
      username: 'testuser',
      email: 'test@example.com',
      senha: 'testpassword',
      descricao_perfil: 'test description',
      nomeArquivoPerfil: 'profile.jpg',
      nomeArquivoCapa: 'cover.jpg',
    };

    (bcrypt as any).hash.mockResolvedValue('hashedpassword');
    jest.spyOn(User.prototype, 'save').mockResolvedValueOnce({ _id: 'someId', ...req.body } as any);

    await create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201); // Corrigido para verificar o status 201
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser' }));
  });


  it('Deve retornar um erro se os nomes dos arquivos não forem fornecidos', async () => {
    req.body = {
      username: 'testuser',
      email: 'test@example.com',
      senha: 'testpassword',
      descricao_perfil: 'test description',
      // Missing nomeArquivoPerfil and nomeArquivoCapa
    };

    await create(req as ExtendedRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nomes dos arquivos não fornecidos.' });
  });
  it('deve lidar com erros ao criar usuario', async () => {
    const errorMessage = 'Erro interno ao salvar as imagens.';
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  }, 100000);
});

describe('User Controller - update', () => {
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
    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      _id: 'someId',
      username: 'userUser',
      email: 'user@example.com',
      senha: 'userPassword',
      descricao_perfil: 'user description',
      foto_perfil: 'existingProfile.jpg',
      foto_capa: 'existingCover.jpg',
      save: jest.fn(),
    } as any);

    req.body = {
      username: 'updatedUser',
      email: 'updated@example.com',
      senha: 'updatedPassword',
      descricao_perfil: 'updated description',
    };

    const nextMock = jest.fn();


    await update(req as Request, res as Response, nextMock);


    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso' });
    expect(nextMock).not.toHaveBeenCalled();
  });


  it('deve retornar um erro se o usuário não for encontrado', async () => {
    // Simulando User.findById para retornar null
    jest.spyOn(User, 'findById').mockResolvedValueOnce(null);

    await update(req as Request, res as Response, () => { });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
  });


  it('deve lidar com atualizações de arquivos', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce({
      _id: 'someId',
      foto_perfil: 'profile.jpg',
      foto_capa: 'cover.jpg',
      save: jest.fn(),
    } as any);

    req.body = {
      username: 'updatedUser',
    };

    req.files = {
      nomeArquivoPerfil: 'existingProfile.jpg',
      nomeArquivoCapa: 'existingCover.jpg'
    } as any;


    const nextMock = jest.fn();


    await update(req as Request, res as Response, nextMock);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso' });
  });

  it('deve lidar com erros ao atualizar usuario', async () => {
    const errorMessage = 'Erro ao atualizar o usuário';
    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  }, 100000);

});

describe('User Controller - remove', () => {
  jest.mock('../src/models/User');
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

    const user = {
      _id: 'someId',
      foto_perfil: 'profile.jpg',
      foto_capa: 'cover.jpg',
      save: jest.fn(),
      remove: jest.fn(),
    } as any;

    jest.spyOn(User, 'findById').mockResolvedValueOnce(user);

    const res = mockResponse();
    const req = { params: { id: 'someId' } } as unknown as Request;

    await remove(req, res)

    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário removido com sucesso' });
  });

  it('deve retornar um erro se o usuário não for encontrado ao tentar remover', async () => {
    // Simulando User.findById para retornar null
    jest.spyOn(User, 'findById').mockResolvedValueOnce(null);
    const res = mockResponse();
    const req = { params: { id: 'someId' } } as unknown as Request;

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
  });

  it('deve lidar com erros ao remover usuario', async () => {
    const errorMessage = 'Erro ao remover o usuário';

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  }, 100000);

});

describe('User Controller - findAll', () => {
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
    const mockUsers = [{
      _id: 'someId',
      username: 'userUser',
      email: 'user@example.com',
      senha: 'userPassword',
      descricao_perfil: 'user description',
      foto_perfil: 'existingProfile.jpg',
      foto_capa: 'existingCover.jpg',
    }, {
      __id: 'someId',
      username: 'userUser2',
      email: 'user@example2.com',
      senha: 'userPassword2',
      descricao_perfil: 'user description2',
      foto_perfil: 'existingProfile2.jpg',
      foto_capa: 'existingCover2.jpg',
    }];



    jest.spyOn(User, 'find').mockResolvedValueOnce(mockUsers);

    await findAll(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('deve lidar com erros ao buscar usuários', async () => {
    const errorMessage = 'Erro ao buscar os usuários.';
    (User.find as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});


describe('loginPost', () => {
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
  it('deve retornar um token válido para credenciais corretas', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        senha: 'senha123',
      },
    } as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;

    // Mock do usuário retornado pelo findOne
    const mockUser = {
      _id: 'mocked-id',
      senha: await bcrypt.hash('senha123', 10),
    };

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    await loginPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    }));
    });

  it('deve retornar erro findOne', async () => {
    const req = {
      body: {},
    } as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;

    // Mock do usuário retornado pelo findOne
    const mockUser = {
      _id: 'mocked-id',
      senha: await bcrypt.hash('senha123', 10),
    };

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    await loginPost(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas. Usuário não encontrado.' });
  });

  it('deve retornar erro string na senha', async () => {
    const req = {
      body: {},
    } as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;

    // Mock do usuário retornado pelo findOne
    const mockUser = {
      _id: 'mocked-id',
      senha: 1,
    };

    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(null);

    await loginPost(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas. Tipo de senha inválido.' });
  });

  it('deve retornar erro interno do servidor em caso de exceção', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        senha: 'senha123',
      },
    } as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;

    // Simula uma exceção ao chamar User.findOne
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Simulated database error'));

    await loginPost(req, res);

    // Verifique se o status 500 e a mensagem de erro interno do servidor foram enviados
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor durante o login.' });
  });

});


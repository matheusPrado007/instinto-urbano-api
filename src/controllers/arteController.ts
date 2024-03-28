import Arte from "../models/Arte";
import { Request, Response } from 'express';
import { deleteFromStorage } from "../middleware/uploadMiddleware";

export const create = async (req: Request, res: Response) => {
  try {
    const { username , nome_artista, nome, uf, cidade, descricao, endereco } = req.body;

    const nomeDoArquivoFirebase: any = req.file;
    console.log(nomeDoArquivoFirebase.firebaseUrl);
    

    if (!nomeDoArquivoFirebase.firebaseUrl) {
      return res.status(400).json({ message: "Nenhuma imagem foi enviada." });
    }

    const arte = new Arte({
      username,
      nome_artista,
      nome,
      foto: nomeDoArquivoFirebase.firebaseUrl,
      descricao,
      uf,
      cidade,
      endereco,
    });

    await arte.save();
    res.status(201).json(arte);
  } catch (err) {
    res.status(500).json({ message: "Erro interno ao salvar a imagem." });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const arteId = req.params.id;
    if (!arteId) {
      return res.status(404).json({ message: "id de params não informado" });
    }
    const arte: any = await Arte.findById(arteId);
    

    if (!arte) {
      return res.status(404).json({ message: "Arte não encontrada" });
    }

    if (req.body.nomeFoto) {
      await deleteFromStorage(arte.foto);
      arte.foto = req.body.nomeFoto;

      await arte.save();

      return res.json({ message: "Imagem atualizada com sucesso" });
    }

    const camposAtualizados = ["nome_artista", "nome", "uf", "cidade", "descricao", "endereco", "username"];

    camposAtualizados.forEach((campo) => {
      if (req.body[campo]) {
        arte[campo] = req.body[campo];
      }
    });

    await arte.save();

    res.json({ message: "Update realizado" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar a imagem" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const arteId = req.params.id;
    const arte = await Arte.findById(arteId);

    if (!arte) {
      return res.status(404).json({ message: "Arte não encontrada" });
    }

    // Excluir a imagem do Firebase Storage
    await deleteFromStorage(arte.foto);

    // Remover a arte do banco de dados
    await arte.remove();

    res.json({ message: "Arte removida com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover a Arte" });
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const arte = await Arte.find();
    res.json(arte);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar as artes." });
  }
};

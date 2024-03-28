export type ArteType = {
    nome_artista: string,
    nome: string;
    descricao: string;
    uf: string;
    cidade: string;
    endereco: string;
    foto: string;
    save(): Promise<void>;
    remove(): Promise<void>;
  };
  
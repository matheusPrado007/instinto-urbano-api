import mongoose from 'mongoose';

const { Schema } = mongoose;

const ArteSchema = new Schema({
  username: { type: String, required: true },
  nome_artista: { type: String, required: true },
  nome: { type: String, required: true },
  foto: { type: String, required: true },
  descricao: { type: String, required: true },
  uf: { type: String, required: true },
  cidade: { type: String, required: true },
  endereco: { type: String, required: true },
});

export default mongoose.model('Arte', ArteSchema);

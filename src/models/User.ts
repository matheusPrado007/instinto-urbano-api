import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  descricao_perfil: { type: String, required: true },
  foto_perfil: { type: String, required: true },
  foto_capa: { type: String, required: false },
  linkedin: { type: String, required: false },
  instagram: { type: String, required: false },
  administrador: { type: Boolean, required: true },
  descricao_curta: { type: String, required: true, maxlength: 100 }
});

export default mongoose.model("User", UserSchema);


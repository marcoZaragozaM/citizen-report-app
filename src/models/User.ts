import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'usuario' | 'moderador' | 'administrador' | 'autoridad';

  // 🔐 NUEVO
  resetToken?: string;
  resetTokenExpire?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ['usuario', 'moderador', 'administrador', 'autoridad'],
      default: 'usuario',
    },

    // 🔐 CAMPOS NUEVOS (RECUPERACIÓN)
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

// 🔒 Encriptar contraseña antes de guardar
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// 🔐 Comparar contraseñas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;

  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

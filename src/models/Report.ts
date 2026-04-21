import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  title: string;
  description: string;
  type: 'bache' | 'basura' | 'alumbrado' | 'fuga';
  image?: string;
  address?: string; // 🔥 NUEVO
  location: {
    lat: number;
    lng: number;
  };
  status: 'pendiente' | 'proceso' | 'resuelto';
  votes: number;
  author: Types.ObjectId;
  votedBy: Types.ObjectId[];
}

const ReportSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    type: {
      type: String,
      enum: ['bache', 'basura', 'alumbrado', 'fuga'],
      required: true,
    },

    image: { type: String },

    address: { type: String }, // 🔥 DIRECCIÓN HUMANA

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: ['pendiente', 'proceso', 'resuelto'],
      default: 'pendiente',
    },

    votes: { type: Number, default: 0 },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    votedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
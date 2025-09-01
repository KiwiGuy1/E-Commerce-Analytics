import mongoose, { Schema, Document } from "mongoose";

// In Product.ts
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  tags?: string[];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  tags: { type: [String] },
});

export default mongoose.model<IProduct>("Product", ProductSchema);

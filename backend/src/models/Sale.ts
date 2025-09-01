import mongoose, { Schema, Document, Types } from "mongoose";
import { IProduct } from "./Product";

export interface ISale extends Document {
  userId: mongoose.Types.ObjectId;
  productId: IProduct; // Always expect populated product
  quantity: number;
  price: number;
  date: Date;
  customerSegment?: string;
  paymentMethod?: string;
}

const SaleSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  customerSegment: { type: String },
  paymentMethod: { type: String },
});

export default mongoose.model<ISale>("Sale", SaleSchema);

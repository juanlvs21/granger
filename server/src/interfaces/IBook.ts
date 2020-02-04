import { Document } from "mongoose";

export default interface IBook extends Document {
  _id: string;
  uuid: string;
  title: string;
  authors?: string;
  editorial?: string;
  yearPublication?: number;
  genre?: [string];
  price: number;
  quantity: number;
  stars: number;
  uploadedBy: {};
  created_date: string;
  folder: string;
  cover: string;
  pdf: string;
}

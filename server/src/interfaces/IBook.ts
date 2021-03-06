import { Document } from "mongoose";

export default interface IBook extends Document {
  _id: string;
  uuid: string;
  title: string;
  wordsTitle: [string];
  slug: string;
  description: string;
  authors?: string;
  yearPublication?: number;
  genre?: [string];
  price: number;
  stars: number;
  scores: [{}];
  uploadedBy: {};
  created_date: string;
  cover: string;
  pdf: string;
}

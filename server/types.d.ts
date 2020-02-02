import { FileArray } from "express-fileupload";

declare namespace Express {
  export interface Request {
    files: FileArray;
  }
}

declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
  }
}

import { Request } from "express";
import multer from "multer";
import uuid from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.join(__dirname + "/uploads/cover"));
  },
  filename: (req: Request, file: any, cb: any) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, uuid.v1() + "-" + fileName);
  }
});

const upload: any = multer({
  storage: storage,
  fileFilter: (req: Request, file: any, cb: any) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  }
});

export default upload;

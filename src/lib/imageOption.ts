import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";

import { v4 } from "uuid";

export const imageOption = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match("jpeg") || file.mimetype.match("png")) {
      callback(null, true);
    } else {
      callback("파일형식잘못됨", false);
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = "public";

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, v4() + "-" + file.originalname);

      console.log(file.originalname);
    },
  }),
};

export const createURL = (file): string => {
  const serverAddress = process.env.SERVER_ADDRESS;
  //ex localhost:4000
  return `${serverAddress}/public/${file.filename}`;
};

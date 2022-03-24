import faker from "@faker-js/faker";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { v4 } from "uuid";

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(mp4|png)$/)) {
      callback(null, true);
    } else {
      callback("파일형식잘못됨", false);
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = "public";

      if (!existsSync(uploadPath)) {
        // public 폴더가 존재하지 않을시, 생성.
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, v4() + file.originalname);
      console.log(v4() + file.originalname);
    },
  }),
};

export const createImageURL = (file): string => {
  const serverAddress = "localhost:4000";

  // 파일이 저장되는 경로: 서버주소/public 폴더
  // 위의 조건에 따라 파일의 경로를 생성.
  return `${serverAddress}/public/${file.filename}`;
};

//파일명수정하기 업로드해야합니다 - 완료
//파일 2개 업로드 해야합니다 - 완료

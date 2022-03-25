import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { upload } from "youtube-videos-uploader/dist";
import { createImageURL, multerOptions } from "../../lib/multerOptions";
import { YoutubeUploadDto } from "./dto/youtubeUpload.dto";

@Controller("api/youtubes")
@ApiTags("유튜브 API")
export class YoutubesController {
  // constructor() {}
  @Post()
  @ApiOperation({
    summary: "유튜브에 영상을 업로드",
    description: "유튜브에 영상을 업로드합니다",
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에 영상을 업로드완료",
    type: YoutubeUploadDto,
  })
  @UseInterceptors(FilesInterceptor("files", 2, multerOptions))
  async uploadYoutubeVideo(
    @Body() updateData,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const videoTitle = updateData.videoTitle;
    const videoDescription = updateData.description;
    const generatedFiles = [];
    let result;
    for (const file of files) {
      generatedFiles.push(file);
      // http://localhost:4000/public/파일이름 형식으로 저장.
    }
    console.log(generatedFiles);

    const credentials = {
      email: process.env.G_ID,
      pass: process.env.G_PASSWORD,
      recoveryemail: process.env.G_RECOVEREMAIL,
    };

    const onVideoUploadSuccess = (videoUrl) => {
      console.log(videoUrl);
      result = videoUrl;
    };

    const video1 = {
      path:
        // "C:/Users/song/Desktop/bird/meta-composer-server/public/" +
        "public/" + generatedFiles[0].filename,
      title: videoTitle,
      description: videoDescription,
      thumbnail:
        // "C:/Users/song/Desktop/bird/meta-composer-server/public/" +
        "public/" + generatedFiles[1].filename,
      language: "korean",
      tags: ["cat"],
      channelName: "송재현",

      onSuccess: onVideoUploadSuccess,

      skipProcessingWait: true,
      onProgress: (progress) => {
        console.log("now progress ==>", progress);
      },
    };

    await upload(credentials, [video1], { headless: true }).then(console.log);
    //업로드파일삭제필요.
    return result;
  }
}

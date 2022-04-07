import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { upload } from "youtube-videos-uploader/dist";
import { createImageURL, multerOptions } from "../../lib/multerOptions";
import { YoutubeUploadDto } from "./dto/youtubeUpload.dto";
import axios, { AxiosResponse } from "axios";
import { youtubeInfo } from "youtube-info";
import { response } from "express";
import { fstat, unlinkSync } from "fs";

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
    unlinkSync(`./public/${generatedFiles[0].filename}`);
    unlinkSync(`./public/${generatedFiles[1].filename}`);
    return result;
  }

  @Get("/one")
  @ApiOperation({
    summary: "유튜브에서 하나의 영상의 정보만 가져옴",
    description:
      "JSON데이터,  youtubeVideoId 를 보내주세요 (유투브 영상 ID값 )",
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에서 하나의 영상의 정보만 가져오기 완료",
    type: YoutubeUploadDto,
  })
  getvideoInfo(@Body() updateData) {
    //하나의 영상의 정보만 가져옴
    console.log("선택된 영상의 정보 출력완료.");

    return axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${updateData.youtubeVideoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics&fields=items(id,snippet(channelId,title,categoryId),statistics)`,
      )
      .then((res) => {
        const videoInfo = res.data;

        // console.log(JSON.stringify(videoInfo));
        return videoInfo;
      });
  }

  @Get("/all")
  @ApiOperation({
    summary: "유튜브에서 채널 전체의 정보를 가져옴",
    description: "유튜브에서 채널 전체의 정보를 가져옴",
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에서 채널 전체의 정보 가져오기 완료",
    type: YoutubeUploadDto,
  })
  async getAllvideosFromChannel() {
    //해당 채널의 모든 영상 목록을 가져옴.
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        const videoInfo = res.data;

        console.log(videoInfo);
        return videoInfo;
      });

    // 1. 반복문으로 videoId 가져옴
    // 2. 위에 개별 영상정보 메서드에 변수로 넣음
    // 3. return 하기전에 배열로 묶어서 보냄
    // 4. [전체,개별묶음] 으로보낼지? [개별묶음] 만 보내면될지 결정

    const videoIds = [];
    //videoId들의 배열
    for (const videoInfo of videoInfos.items) {
      if (videoInfo.id.kind == "youtube#video") {
        videoIds.push(videoInfo.id.videoId);
        // console.log(videoInfo.id.videoId);
        // return this.getvideoInfo(videoInfo.id.videoId);
      }
    }
    console.log(videoIds);
    return { "유투브 채널 정보": videoInfos, "유투브 영상 ID값": videoIds };

    // console.log(videoIds);
  }
}

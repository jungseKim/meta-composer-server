import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
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
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { createQueryBuilder, getRepository, Repository } from "typeorm";
import { ConcoursSignup } from "src/entities/concoursSignup.entity";
import { AuthGuard } from "@nestjs/passport";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { Concours } from "src/entities/concours.entity";

//
@Controller("api/youtubes")
@ApiTags("유튜브 API")
export class YoutubesController {
  constructor() {}
  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({
    summary: "유튜브에 영상을 업로드",
    description:
      "유튜브에 영상을 업로드합니다 Query string 으로는 id (콩쿠르 번호),form 데이터에 videoTitle 는 string,  description 는 string, files 배열에 첫번째는 영상(.mp4) 두번째는 썸네일(png or jpg)",
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
    @Query("id", ParseIntPipe) id: number,
    @UserDecorator() user: User,
  ): Promise<any> {
    const concours = await getRepository(Concours)
      .createQueryBuilder("concours")
      .where("concours.id = :id", {
        id: id,
      })
      .getOne();

    console.log(concours.title + " :콩쿠르명");

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
      channelName: process.env.YOUTUBE_CHANNEL_NAME,
      playlist: concours.title,

      onSuccess: onVideoUploadSuccess,

      skipProcessingWait: true,
      onProgress: (progress) => {
        console.log("now progress ==>", progress);
      },
    };

    await upload(credentials, [video1], {
      headless: true,
    }).then(console.log);
    //업로드파일삭제필요.
    unlinkSync(`./public/${generatedFiles[0].filename}`);
    unlinkSync(`./public/${generatedFiles[1].filename}`);

    await createQueryBuilder("concours_signup")
      .update(ConcoursSignup)
      .set({
        youtubeURL: result + "",
      })
      .where("concoursId = :id", {
        id: id,
      })
      .where("userId = :id", {
        id: user.id,
      })
      .execute();

    return result;
  }

  @Get("/one")
  @ApiOperation({
    summary: "유튜브에서 하나의 영상의 정보만 가져옴",
    description: `JSON데이터,  youtubeVideoId 를 보내주세요 (유투브 영상 ID값 ) , 예시 =>  { "youtubeVideoId" : "0B_dNvTGkQs"} `,
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에서 하나의 영상의 정보만 가져오기 완료",
  })
  @UseInterceptors(TransformResponseInterceptor)
  getvideoInfo(@Body() updateData) {
    //하나의 영상의 정보만 가져옴
    console.log("선택된 영상의 정보 출력완료.");

    return axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${updateData.youtubeVideoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
        //&fields=items(id,snippet(channelId,title,categoryId),statistics)
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
  @UseInterceptors(TransformResponseInterceptor)
  async getAllvideosFromChannel() {
    //해당 채널의 모든 영상 목록을 가져옴.
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`,
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

  @Get("/top3view")
  @ApiOperation({
    summary:
      "유튜브에서 채널 전체의 정보를 가져와서 조회수3위까지  (명예의전당, 전체채널)",
    description:
      "유튜브에서 채널 전체의 정보를 가져와서 조회수3위까지  (명예의전당, 전체채널)",
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에서 채널 전체의 정보를 가져와서 조회수3위까지 완료",
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getTop3viewsFromVideo() {
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&contentDetails&topicDetails&invideoPromotion&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        const videoInfo = res.data;

        console.log(videoInfo);
        return videoInfo;
      });

    const videoIds = [];
    //videoId들의 배열
    for (const videoInfo of videoInfos.items) {
      if (videoInfo.id.kind == "youtube#video") {
        videoIds.push(videoInfo.id.videoId);
        // console.log(videoInfo.id.videoId);
        // return this.getvideoInfo(videoInfo.id.videoId);
      }
    }

    const viewCountandVideoIdArray = [];
    for (const videoId in videoIds) {
      // console.log(videoIds[videoId]);

      const itemWithvideo = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoIds[videoId]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics&fields=items(id,snippet(channelId,title,categoryId),statistics)`,
        )
        .then((res) => {
          const videoInfo = res;

          // console.log(JSON.stringify(videoInfo));
          // console.log(videoInfo.data.items[0].statistics.viewCount);
          return [
            videoInfo.data.items[0].statistics.viewCount,
            videoInfo.data.items[0].id,
          ];
        });

      viewCountandVideoIdArray.push(itemWithvideo);
    }
    console.log(viewCountandVideoIdArray);

    const newArray = viewCountandVideoIdArray.sort(function (x, y) {
      return y[0] - x[0];
    });
    console.log(newArray[0]);

    console.log(newArray);
    console.log("ㅡㅡㅡㅡㅡㅡㅡ");
    const resultArray = [];
    for (let i = 0; i < 3; i++) {
      console.log(newArray[i][1]);

      const result = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
          //&fields=items(id,snippet(channelId,title,categoryId),statistics)
        )
        .then((res) => {
          const videoInfo = res.data;

          // console.log(JSON.stringify(videoInfo));
          return videoInfo;
        });
      resultArray.push(result);
    }
    console.log(resultArray);
    return resultArray;
  }

  @Get("/top3comment")
  @ApiOperation({
    summary:
      "유튜브에서 채널 전체의 정보를 가져와서 댓글3위까지 (명예의전당, 전체채널)",
    description:
      "유튜브에서 채널 전체의 정보를 가져와서 댓글3위까지  (명예의전당, 전체채널)",
  })
  @ApiResponse({
    status: 200,
    description: "유튜브에서 채널 전체의 정보를 가져와서 댓글3위까지 완료",
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getTop3commentFromVideo() {
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&contentDetails&topicDetails&invideoPromotion&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        const videoInfo = res.data;

        console.log(videoInfo);
        return videoInfo;
      });

    const videoIds = [];
    //videoId들의 배열
    for (const videoInfo of videoInfos.items) {
      if (videoInfo.id.kind == "youtube#video") {
        videoIds.push(videoInfo.id.videoId);
        // console.log(videoInfo.id.videoId);
        // return this.getvideoInfo(videoInfo.id.videoId);
      }
    }

    const viewCountandVideoIdArray = [];
    for (const videoId in videoIds) {
      // console.log(videoIds[videoId]);

      const itemWithvideo = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoIds[videoId]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics&fields=items(id,snippet(channelId,title,categoryId),statistics)`,
        )
        .then((res) => {
          const videoInfo = res;

          // console.log(JSON.stringify(videoInfo));
          // console.log(videoInfo.data.items[0].statistics.viewCount);
          return [
            videoInfo.data.items[0].statistics.commentCount,
            videoInfo.data.items[0].id,
          ];
        });

      viewCountandVideoIdArray.push(itemWithvideo);
    }
    console.log(viewCountandVideoIdArray);

    const newArray = viewCountandVideoIdArray.sort(function (x, y) {
      return y[0] - x[0];
    });
    console.log(newArray[0]);

    const resultArray = [];
    for (let i = 0; i < 3; i++) {
      console.log(newArray[i][1]);

      const result = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
          //&fields=items(id,snippet(channelId,title,categoryId),statistics)
        )
        .then((res) => {
          const videoInfo = res.data;

          // console.log(JSON.stringify(videoInfo));
          return videoInfo;
        });
      resultArray.push(result);
    }
    console.log(resultArray);
    return resultArray;
  }

  @Get("/playlist3topcomment/:id")
  @ApiOperation({
    summary: "콩쿠르 id를 지정하여 top3 의 댓글수 랭킹",
    description:
      "playlist3topcomment  콩쿠르 id를 지정하여 top3 의 댓글수 랭킹. 단 영상이 3개미만일경우 3개 미만으로 나옵니다.  Params 로 검색할 콩쿠르의 id값 지정해 주세요",
  })
  @ApiResponse({
    status: 200,
    description:
      "playlist3topcomment  콩쿠르 id를 지정하여 top3 의 댓글수 랭킹. 단 영상이 3개미만일경우 3개 미만으로 나옵니다",
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getPlaylist3comment(@Param("id", ParseIntPipe) id: number) {
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&topicDetails&invideoPromotion&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        const videoInfo = res.data;

        // console.log(videoInfo);
        return videoInfo;
      });

    // console.log(videoInfos.items);

    const channelId_list = [];
    for (const item in videoInfos.items) {
      channelId_list.push(videoInfos.items[item].id);
    }

    const channelId_list_reverse = channelId_list.reverse();
    // console.log(channelId_list_reverse);

    // const playlist_items = [];
    // for (const item in channelId_list) {
    // }

    const playlist_title_list = [];
    for (const item in videoInfos.items) {
      playlist_title_list.push(videoInfos.items[item].snippet.title);
    }

    const playlist_title_list_reverse = playlist_title_list.reverse();
    // console.log(playlist_title_list_reverse);
    const concours = await getRepository(Concours)
      .createQueryBuilder("concours")
      .where("concours.id = :id", {
        id: id,
      })
      .getOneOrFail();

    if (concours) {
      const concours_name = concours.title;
      // console.log(concours_name);

      const index_num = playlist_title_list_reverse.indexOf(concours_name);
      // console.log(index_num);
      const selected_playlist_id = channelId_list[index_num];
      // console.log(selected_playlist_id);

      const selected_playlist_videolist = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=25&playlistId=${selected_playlist_id}&key=${process.env.YOUTUBE_API_KEY}`,
        )
        .then((res) => {
          const videoInfos = res.data;

          // console.log(videoInfos);
          return videoInfos;
        });

      const selected_playlist_videolist_id_list = [];

      for (const selected_playlist_videolist_id in selected_playlist_videolist) {
        selected_playlist_videolist_id_list.push(
          selected_playlist_videolist[selected_playlist_videolist_id],
        );
      }
      console.log(selected_playlist_videolist_id_list[2]);
      console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");

      const selected_playlist_videolist_id_list_video = [];

      for (const selected_playlist_videolist_id_video in selected_playlist_videolist_id_list[2]) {
        selected_playlist_videolist_id_list_video.push(
          selected_playlist_videolist_id_list[2][
            selected_playlist_videolist_id_video
          ].snippet.resourceId.videoId,
        );
      }
      const viewCountandVideoIdArray = [];
      for (const videoId in selected_playlist_videolist_id_list_video) {
        // console.log(videoIds[videoId]);

        const itemWithvideo = await axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${selected_playlist_videolist_id_list_video[videoId]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics&fields=items(id,snippet(channelId,title,categoryId),statistics)`,
          )
          .then((res) => {
            const videoInfo = res;

            // console.log(JSON.stringify(videoInfo));
            // console.log(videoInfo.data.items[0].statistics.viewCount);
            return [
              videoInfo.data.items[0].statistics.commentCount,
              videoInfo.data.items[0].id,
            ];
          });

        viewCountandVideoIdArray.push(itemWithvideo);
      }
      console.log(viewCountandVideoIdArray);

      const newArray = viewCountandVideoIdArray.sort(function (x, y) {
        return y[0] - x[0];
      });

      console.log(newArray);
      const resultArray = [];
      if (newArray.length >= 3) {
        for (let i = 0; i < 3; i++) {
          console.log(newArray[i][1]);

          const result = await axios
            .get(
              `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
              //&fields=items(id,snippet(channelId,title,categoryId),statistics)
            )
            .then((res) => {
              const videoInfo = res.data;

              // console.log(JSON.stringify(videoInfo));
              return videoInfo;
            });
          resultArray.push(result);
        }
        console.log(resultArray);
        return resultArray;
      } else if (newArray.length < 3) {
        for (let i = 0; i < newArray.length; i++) {
          console.log(newArray[i][1]);

          const result = await axios
            .get(
              `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
              //&fields=items(id,snippet(channelId,title,categoryId),statistics)
            )
            .then((res) => {
              const videoInfo = res.data;

              // console.log(JSON.stringify(videoInfo));
              return videoInfo;
            });
          resultArray.push(result);
        }
        console.log(resultArray);
        return resultArray;
      }
    } else {
      return "아직 업로드된 영상이 없습니다.";
    }

    return videoInfos;
  }

  @Get("/playlist3topview/:id")
  @ApiOperation({
    summary: "콩쿠르 id를 지정하여 top3 의 조회수 랭킹",
    description:
      "playlist3topview  콩쿠르 id를 지정하여 top3 의 조회수 랭킹. 단 영상이 3개미만일경우 3개 미만으로 나옵니다.  Params 로 검색할 콩쿠르의 id값 지정해 주세요",
  })
  @ApiResponse({
    status: 200,
    description:
      "playlist3topview  콩쿠르 id를 지정하여 top3 의 조회수 랭킹. 단 영상이 3개미만일경우 3개 미만으로 나옵니다",
  })
  @UseInterceptors(TransformResponseInterceptor)
  async getPlaylist3view(@Param("id", ParseIntPipe) id: number) {
    const videoInfos = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&topicDetails&invideoPromotion&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`,
      )
      .then((res) => {
        const videoInfo = res.data;

        // console.log(videoInfo);
        return videoInfo;
      });

    // console.log(videoInfos.items);

    const channelId_list = [];
    for (const item in videoInfos.items) {
      channelId_list.push(videoInfos.items[item].id);
    }

    const channelId_list_reverse = channelId_list.reverse();
    // console.log(channelId_list_reverse);

    // const playlist_items = [];
    // for (const item in channelId_list) {
    // }

    const playlist_title_list = [];
    for (const item in videoInfos.items) {
      playlist_title_list.push(videoInfos.items[item].snippet.title);
    }

    const playlist_title_list_reverse = playlist_title_list.reverse();
    // console.log(playlist_title_list_reverse);
    const concours = await getRepository(Concours)
      .createQueryBuilder("concours")
      .where("concours.id = :id", {
        id: id,
      })
      .getOneOrFail();

    if (concours) {
      const concours_name = concours.title;
      // console.log(concours_name);

      const index_num = playlist_title_list_reverse.indexOf(concours_name);
      // console.log(index_num);
      const selected_playlist_id = channelId_list[index_num];
      // console.log(selected_playlist_id);

      const selected_playlist_videolist = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=25&playlistId=${selected_playlist_id}&key=${process.env.YOUTUBE_API_KEY}`,
        )
        .then((res) => {
          const videoInfos = res.data;

          // console.log(videoInfos);
          return videoInfos;
        });

      const selected_playlist_videolist_id_list = [];

      for (const selected_playlist_videolist_id in selected_playlist_videolist) {
        selected_playlist_videolist_id_list.push(
          selected_playlist_videolist[selected_playlist_videolist_id],
        );
      }
      console.log(selected_playlist_videolist_id_list[2]);
      console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");

      const selected_playlist_videolist_id_list_video = [];

      for (const selected_playlist_videolist_id_video in selected_playlist_videolist_id_list[2]) {
        selected_playlist_videolist_id_list_video.push(
          selected_playlist_videolist_id_list[2][
            selected_playlist_videolist_id_video
          ].snippet.resourceId.videoId,
        );
      }
      const viewCountandVideoIdArray = [];
      for (const videoId in selected_playlist_videolist_id_list_video) {
        // console.log(videoIds[videoId]);

        const itemWithvideo = await axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${selected_playlist_videolist_id_list_video[videoId]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics&fields=items(id,snippet(channelId,title,categoryId),statistics)`,
          )
          .then((res) => {
            const videoInfo = res;

            // console.log(JSON.stringify(videoInfo));
            // console.log(videoInfo.data.items[0].statistics.viewCount);
            return [
              videoInfo.data.items[0].statistics.viewCount,
              videoInfo.data.items[0].id,
            ];
          });

        viewCountandVideoIdArray.push(itemWithvideo);
      }
      console.log(viewCountandVideoIdArray);

      const newArray = viewCountandVideoIdArray.sort(function (x, y) {
        return y[0] - x[0];
      });

      console.log(newArray);
      const resultArray = [];
      if (newArray.length >= 3) {
        for (let i = 0; i < 3; i++) {
          console.log(newArray[i][1]);

          const result = await axios
            .get(
              `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
              //&fields=items(id,snippet(channelId,title,categoryId),statistics)
            )
            .then((res) => {
              const videoInfo = res.data;

              // console.log(JSON.stringify(videoInfo));
              return videoInfo;
            });
          resultArray.push(result);
        }
        console.log(resultArray);
        return resultArray;
      } else if (newArray.length < 3) {
        for (let i = 0; i < newArray.length; i++) {
          console.log(newArray[i][1]);

          const result = await axios
            .get(
              `https://www.googleapis.com/youtube/v3/videos?id=${newArray[i][1]}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
              //&fields=items(id,snippet(channelId,title,categoryId),statistics)
            )
            .then((res) => {
              const videoInfo = res.data;

              // console.log(JSON.stringify(videoInfo));
              return videoInfo;
            });
          resultArray.push(result);
        }
        console.log(resultArray);
        return resultArray;
      }
    } else {
      return "아직 업로드된 영상이 없습니다.";
    }

    return videoInfos;
  }
}

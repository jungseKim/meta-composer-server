import { ApiProperty } from "@nestjs/swagger";

export class YoutubeUploadDto {
  @ApiProperty({
    example: "제목입니다",
    description: "유튜브에 업로드할 콩쿠르 영상 제목",
  })
  videoTitle: string;

  @ApiProperty({
    example: "유튜브 영상 설명",
    description: "유튜브에 업로드할 콩쿠르 영상 썸네일",
  })
  description: string;

  @ApiProperty({
    example: "첫번째 첨부파일은 영상(.mp4), 두번째는 썸네일(.png)을 올려주세요",
    description:
      "첫번째 첨부파일은 영상(.mp4), 두번째는 썸네일(.png)을 올려주세요",
  })
  files: string;
}

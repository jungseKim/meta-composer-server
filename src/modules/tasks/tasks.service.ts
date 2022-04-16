import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { nanoid } from "nanoid";
import { Signup } from "src/entities/signup.entity";
import { LessonClassService } from "src/gateways/lesson-class/lesson-class.service";
import { NotificationService } from "src/gateways/notification/notification.service";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  time: Date;
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
    private lessonClassService: LessonClassService,
    @InjectRepository(Signup)
    private signupRepository: Repository<Signup>,
  ) {}

  public async signupNotification(
    signup: Signup,
    current: number,
    last: number,
  ) {
    if (signup == null) {
      signup = await this.signupRepository.findOne(2);
    }
    if (current > last) {
      return;
    }
    const times = signup.signuptimetables;
    times.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    const currentTime = times[current];
    console.log(currentTime);
    //여기서 5분 빼줘야됨 지금은 개발단계라서 이상태로 킵고잉
    const date = new Date(currentTime.time);
    if (date < new Date()) {
      return this.signupNotification(signup, current + 1, last);
    }
    console.log(date); //이부분 date 로 다시
    const job = new CronJob(new Date(Date.now() + 10 * 1000), async () => {
      this.logger.warn(`time  for job ${current} to run!`);

      await this.notificationService.pushStarClass(signup);
      await this.lessonClassService.clasStart(signup, currentTime.id);

      if (current !== last) {
        this.signupNotification(signup, current + 1, last);
      }
    });
    this.schedulerRegistry.addCronJob(currentTime.id.toString(), job);
    job.start();
  }

  //만약 레슨 시간 변경시에는 취소한다음 다시 수강
  public async cancleSignNotification(signup: Signup) {
    if (signup == null) {
      signup = await this.signupRepository.findOne(2);
    }
    const times = signup.signuptimetables;
    times.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

    const currentDate = new Date();
    const tiem = times.find(
      (signTime) => new Date(signTime.time) > currentDate,
    );
    this.schedulerRegistry.deleteCronJob(tiem.id.toString());
  }
}

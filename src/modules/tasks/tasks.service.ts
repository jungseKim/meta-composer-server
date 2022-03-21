import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { nanoid } from "nanoid";
import { Signup } from "src/entities/signup.entity";
import { NotificationService } from "src/gateways/notification/notification.service";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  time: Date;
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
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
    const times = signup.signuptimetables;
    times.sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    const currentTime = times[current];
    const date = new Date(currentTime.time);

    if (date < new Date()) {
      return this.signupNotification(signup, current + 1, last);
    }

    const job = new CronJob(date, async () => {
      this.logger.warn(`time  for job ${current} to run!`);
      console.log("ruunnnn!!!");
      await this.notificationService.pushStarClass(signup);
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

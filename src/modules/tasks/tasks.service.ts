import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { CronJob } from "cron";
import { nanoid } from "nanoid";
import { Signup } from "src/entities/signup.entity";
import { NotificationService } from "src/gateways/notification/notification.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  time: Date;
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
  ) {}

  signupNotification(signup: Signup, current: number, last: number) {
    const times = signup.signuptimetables;
    times.sort((a, b) => {
      return a.time - b.time;
    });

    const currentTime = times[current];
    const date = new Date(currentTime.time);

    const job = new CronJob(date, () => {
      this.logger.warn(`time  for job ${current} to run!`);
      this.notificationService.pushStarClass(signup);
      if (current !== last) {
        this.signupNotification(signup, current++, last);
      }
    });

    this.schedulerRegistry.addCronJob(currentTime.id.toString(), job);
    job.start();
  }
}

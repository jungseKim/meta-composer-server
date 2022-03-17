import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { CronJob } from "cron";
import { nanoid } from "nanoid";
import { Signup } from "src/entities/signup.entity";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  time: Date;
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  signupNotification(signup: Signup, date: Date, lastDate: Date) {
    //  const id = nanoid(5);
    // // const date=new Date
    // const job = new CronJob(date, () => {
    //   this.logger.warn(`time  for job ${name} to run!`);
    //   this.signupNotification(id, new Date(Date.now() + 2 * 1000));
    // });
    // this.schedulerRegistry.addCronJob(name, job);
    // job.start();
  }
}

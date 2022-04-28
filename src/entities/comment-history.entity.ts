// import {
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { Lesson } from "./lesson.entity";
// import { User } from "./user.entity";

// @Entity()
// export class CommentHistory extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => User, (user) => user.commentHistory, {
//     nullable: false,
//     onDelete: "CASCADE",
//   })
//   user: User;

//   @ManyToOne(() => Lesson, (lesson) => lesson.commentHistory, {
//     onDelete: "CASCADE",
//   })
//   lesson: Lesson;

//   @JoinColumn()
//   @OneToOne(() => Comment, (comments) => comments.commentHistory, {
//     onDelete: "CASCADE",
//   })
//   comments: Comment;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;
// }

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Idea } from './idea.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  grade: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comment, { eager: true, onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => Idea, (idea) => idea.comments, { eager: true, onDelete: 'CASCADE' })
  idea: Idea;
}

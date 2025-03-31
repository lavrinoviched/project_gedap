import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  initiator: string;

  @Column('simple-array')
  techStack: string[];

  @Column()
  ideaStatus: string;

  @Column()
  teamSize: number;

  @Column()
  reward: number;

  @Column()
  category: string;

  @Column()
  difficulty: string;

  @Column()
  deadline: Date;

  @Column()
  rewardType: string;
}
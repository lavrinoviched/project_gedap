import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  complexity: string;

  @Column()
  status: string;
  
  @Column()
  reward: number;
  
  @Column()
  deadline: Date;
  
  @Column()
  initiator: string;

  @Column()
  teamSize: number;
  
  @Column()
  hasReward: boolean;
  
  @Column('simple-array')
  technologies: string[];

  @Column()
  description: string;
}
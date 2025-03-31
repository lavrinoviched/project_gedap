import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserCommandStatus, Role } from 'src/common/types';
import { Team } from './team.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn()
  entryDate: Date;
  
  @UpdateDateColumn()
  exclusionDate: Date;

  @Column({ default: UserCommandStatus.inTeam })
  status: UserCommandStatus;

  @ManyToOne(() => Team, (team) => team.id, { onDelete: 'CASCADE' })
  team: Team;

  @ManyToOne(() => User, (user) => user.portfolio, { onDelete: 'CASCADE' })
  user: User;

  // ============ Поля для студентов (role = 'user') ============
  @Column({ 
    type: 'simple-array', 
    nullable: true,
    comment: 'Навыки студента (технологии, языки и т.д.)' 
  })
  skills: string[];

  @Column({ 
    nullable: true,
    comment: 'Учебная группа или специальность студента' 
  })
  education: string;

  @Column({ 
    type: 'simple-array', 
    nullable: true,
    comment: 'Сертификации и курсы студента' 
  })
  certifications: string[];

  @Column({ 
    type: 'json', 
    nullable: true,
    comment: 'Проекты, в которых участвовал студент' 
  })
  studentProjects: Array<{
    title: string;
    description: string;
    role: string;
    responsibilities: string[];
    startDate: Date;
    endDate?: Date;
    isCompleted: boolean;
  }>;

  // ============ Поля для заказчиков (role = 'customer') ============
  @Column({ 
    nullable: true,
    comment: 'Описание компании/деятельности заказчика' 
  })
  description: string;

  @Column({ 
    nullable: true,
    comment: 'Отрасль деятельности заказчика' 
  })
  industry: string;

  @Column({ 
    type: 'json', 
    nullable: true,
    comment: 'Проекты, которые заказчик предлагает студентам' 
  })
  offeredProjects: Array<{
    title: string;
    description: string;
    requiredSkills: string[];
    expectedDuration: string;
    budget?: number;
    startDate: Date;
    applicationDeadline: Date;
    status: 'open' | 'in_progress' | 'completed';
  }>;
}
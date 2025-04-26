import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Team } from './team.entity';
import { Role, UserAccountStatus, SecuredUser, Technology, TechnologyName } from 'src/common/types';
import { Idea } from './idea.entity';
import { Portfolio } from './portfolio.entity';
import { Comments } from './comment.entity';
import { Project } from './project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: '' })
  firstname: string;

  @Column({ default: '' })
  lastname: string;

  @Column({ default: '' })
  group: string;

  @Column({ default: '' })
  telephone: string;

  // Авторизация и роли
  @Column({ type: 'varchar', default: [Role.user], array: true })
  roles: Role[];

  @Column({ default: UserAccountStatus.pending })
  status: UserAccountStatus;

  // Профиль и компетенции
  @Column({ nullable: true })
  avatarPath?: string;


  @Column('simple-json', { nullable: true })
  experience?: {
    years: number;
    projectsCompleted: number;
    technologies?: TechnologyName[]; // Add technologies here
  };


  @Column('simple-json', { nullable: true })
  technologies?: Technology[]; // Store as JSON array

  @Column('simple-json', { nullable: true })
  personalQualities?: {
    communication: number;
    teamwork: number;
    leadership: number;
    reliability: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Связи с другими сущностями
  @OneToOne(() => Team, (team) => team.user_leader)
  team_leader: Team;

  @OneToMany(() => Team, (team) => team.user_owner)
  team_owner: Team[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolio: Portfolio[];

  @OneToMany(() => Idea, (idea) => idea.initiator)
  idea_initiator: Idea[];

  @OneToMany(() => Idea, (idea) => idea.customer)
  idea_customer: Idea[];

  @OneToMany(() => Project, (project) => project.initiator)
  project_initiator: Project[];

  @OneToMany(() => Project, (project) => project.customer)
  project_customer: Project[];

  @OneToMany(() => Comments, (comment) => comment.users)
  comment: Comments[];

  @ManyToOne(() => Team, (team) => team.user, { eager: true, onDelete: 'SET NULL' })
  team: Team;

  getSecuredDto(): SecuredUser {
    const result: any = { // Используем any для временного обхода проверки типов
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      roles: this.roles,
      status: this.status,
      avatarPath: this.avatarPath,
      experience: this.experience,
      technologies: this.technologies,
      personalQualities: this.personalQualities,
      telephone: this.telephone
    };
  
    // Для админа не возвращаем группу
    if (!this.roles.includes(Role.admin)) {
      result.group = this.group;
    }
  
    return result as SecuredUser; // Приводим к типу SecuredUser
  }
}

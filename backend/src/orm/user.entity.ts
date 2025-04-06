import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Team } from './team.entity';
import { Role, UserAccountStatus, SecuredUser } from 'src/common/types';
import { Idea } from './idea.entity';
import { Portfolio } from './portfolio.entity';
import { Comments } from './comment.entity';
import { Project } from './project.entity';
import { Technology } from './technology.entity'; 

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
  };


  @ManyToMany(() => Technology, { eager: true }) 
  @JoinTable({
    name: 'user_technologies', 
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' }
  })
  technologies: Technology[];


  @Column('simple-json', { nullable: true })
  personalQualities?: {
    communication: number;
    teamwork: number;
    leadership: number;
    reliability: number;
  };

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  getSecuredDto(): SecuredUser {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      roles: this.roles,
      status: this.status,
      avatarPath: this.avatarPath,
      experience: this.experience,
      technologies: this.technologies, 
      personalQualities: this.personalQualities
    };
  }
}
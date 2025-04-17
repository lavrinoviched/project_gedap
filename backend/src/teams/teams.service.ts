import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { Team } from '../orm/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FilterTeamDto } from './dto/filter-team.dto';
import { User } from '../orm/user.entity';
import { Project } from '../orm/project.entity';
import { PrivacyTeam, StatusTeam } from '../common/types';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const leader = await this.validateUserExists(createTeamDto.user_leaderId);
    
    const team = this.teamRepository.create({
      name: createTeamDto.name,
      description: createTeamDto.description || '',
      privacy: createTeamDto.privacy || PrivacyTeam.open,
      status: createTeamDto.status || StatusTeam.recruiting,
      user_leader: leader,
      user_owner: leader,
    });

    return this.teamRepository.save(team);
  }

  async findAll(filter?: FilterTeamDto): Promise<Team[]> {
    const where: FindOptionsWhere<Team> = {};
  
    if (filter?.status) where.status = filter.status;
    if (filter?.privacy) where.privacy = filter.privacy;
    if (filter?.user_leaderId) where.user_leader = { id: filter.user_leaderId };
  
    return this.teamRepository.find({
      where,
      relations: {
        user_leader: true,
        user: true,
        project: true,
        user_owner: true,
      },
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: {
        user_leader: true,
        user: true,
        portfolio: true,
        project: true,
        user_owner: true,
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

    if (updateTeamDto.newLeaderId) {
      team.user_leader = await this.validateUserExists(updateTeamDto.newLeaderId);
    }

    if (updateTeamDto.name) team.name = updateTeamDto.name;
    if (updateTeamDto.description !== undefined) team.description = updateTeamDto.description;
    if (updateTeamDto.privacy) team.privacy = updateTeamDto.privacy;
    if (updateTeamDto.status) team.status = updateTeamDto.status;

    return this.teamRepository.save(team);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  async updateStatus(id: number, status: StatusTeam): Promise<Team> {
    const team = await this.findOne(id);
    team.status = status;
    return this.teamRepository.save(team);
  }

  async addUserToTeam(teamId: number, userId: number): Promise<Team> {
    const [team, user] = await Promise.all([
      this.findOne(teamId),
      this.validateUserExists(userId),
    ]);

    if (!team.user) team.user = [];
    
    // Проверяем, не состоит ли уже пользователь в команде
    if (team.user.some(u => u.id === user.id)) {
      return team;
    }

    team.user.push(user);
    return this.teamRepository.save(team);
  }

  async removeUserFromTeam(teamId: number, userId: number): Promise<Team> {
    const team = await this.findOne(teamId);
    
    if (team.user) {
      team.user = team.user.filter(user => user.id !== userId);
      return this.teamRepository.save(team);
    }
    
    return team;
  }

  async assignToProject(teamId: number, projectId: number): Promise<Team> {
    const [team, project] = await Promise.all([
      this.findOne(teamId),
      this.validateProjectExists(projectId),
    ]);

    team.project = project;
    return this.teamRepository.save(team);
  }

  async unassignFromProject(teamId: number): Promise<Team> {
    const team = await this.findOne(teamId);
    team.project = null; // Теперь работает после изменения сущности
    team.status = StatusTeam.recruiting; // Обновляем статус
    return this.teamRepository.save(team);
  }

  async getTeamProjects(id: number): Promise<Project[]> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team.project ? [team.project] : [];
  }

  private async validateUserExists(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private async validateProjectExists(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project;
  }
}
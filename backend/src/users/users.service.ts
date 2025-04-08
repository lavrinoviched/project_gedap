import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, UpdateUserDto, UserAccountStatus, UpdateProfileDto } from 'src/common/types';
import { User } from 'src/orm/user.entity';
import { Technology } from 'src/orm/technology.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  // Методы аутентификации
  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      relations: ['technologies']
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['technologies']
    });
  }

  async create(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    roles: Role[] = [Role.user],
    status = UserAccountStatus.pending,
    technologies: string[] = []
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.roles = roles;
    user.status = status;

    if (technologies && technologies.length > 0) {
      const techEntities = await this.technologyRepository.find({
        where: { name: In(technologies) }
      });
      user.technologies = techEntities;
    }

    return this.userRepository.save(user);
  }

  // Методы управления профилем
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['technologies']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Обновление базовых полей
    if (dto.firstname) user.firstname = dto.firstname;
    if (dto.lastname) user.lastname = dto.lastname;
    if (dto.email) user.email = dto.email;
    if (dto.telephone) user.telephone = dto.telephone;
    if (dto.group) user.group = dto.group;

    // Обновление технологий
    if (dto.technologies) {
      const techEntities = await this.technologyRepository.find({
        where: { name: In(dto.technologies) }
      });
      user.technologies = techEntities;
    }

    // Обновление опыта
    if (dto.yearsOfExperience || dto.projectsCompleted) {
      user.experience = {
        years: dto.yearsOfExperience ?? user.experience?.years ?? 0,
        projectsCompleted: dto.projectsCompleted ?? user.experience?.projectsCompleted ?? 0,
      };
    }

    // Обновление личных качеств
    if (dto.communicationSkill || dto.teamworkSkill || dto.leadershipSkill || dto.reliabilitySkill) {
      user.personalQualities = {
        communication: dto.communicationSkill ?? user.personalQualities?.communication ?? 0,
        teamwork: dto.teamworkSkill ?? user.personalQualities?.teamwork ?? 0,
        leadership: dto.leadershipSkill ?? user.personalQualities?.leadership ?? 0,
        reliability: dto.reliabilitySkill ?? user.personalQualities?.reliability ?? 0,
      };
    }

    // Обновление аватарки
    if (dto.avatarPath) {
      user.avatarPath = dto.avatarPath;
    }

    return this.userRepository.save(user);
  }

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['technologies'],
      select: [
        'id',
        'email',
        'firstname',
        'lastname',
        'telephone',
        'group',
        'avatarPath',
        'experience',
        'personalQualities',
        'roles',
        'status',
        'technologies'
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Методы работы с технологиями
  async addTechnologiesToUser(userId: number, techNames: string[]): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['technologies']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const technologies = await this.technologyRepository.find({
      where: { name: In(techNames) }
    });

    // Добавляем только новые технологии, избегая дублирования
    const existingTechIds = user.technologies.map(t => t.id);
    const newTechnologies = technologies.filter(t => !existingTechIds.includes(t.id));
    
    user.technologies = [...user.technologies, ...newTechnologies];
    return this.userRepository.save(user);
  }

  async removeTechnologiesFromUser(userId: number, techNames: string[]): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['technologies']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.technologies = user.technologies.filter(
      tech => !techNames.includes(tech.name)
    );
    
    return this.userRepository.save(user);
  }

  // Методы администратора
  async setStatus(id: number, status: UserAccountStatus): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    await this.userRepository.save(user);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      relations: ['technologies']
    });
    
    return users.map(user => {
      const { passwordHash, ...securedUser } = user;
      return securedUser;
    });
  }

  async update(id: number, updatedUserData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['technologies']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updatedUserData);
    return this.userRepository.save(user);
  }
}
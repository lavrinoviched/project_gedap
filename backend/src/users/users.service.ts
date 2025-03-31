import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/orm/user.entity';
import * as bcrypt from 'bcrypt';
import { Role, UpdateUserDto, UserAccountStatus, UpdateProfileDto } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Методы аутентификации
  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    roles: Role[] = [Role.user],
    status = UserAccountStatus.pending,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.roles = roles;
    user.status = status;
    
    return this.userRepository.save(user);
  }

  // Методы управления профилем
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Обновление базовых полей
    if (dto.firstname) user.firstname = dto.firstname;
    if (dto.lastname) user.lastname = dto.lastname;
    if (dto.email) user.email = dto.email;
    if (dto.telephone) user.telephone = dto.telephone;
    if (dto.group) user.group = dto.group;

    // Обновление опыта
    if (dto.yearsOfExperience || dto.projectsCompleted) {
      user.experience = {
        years: dto.yearsOfExperience ?? user.experience?.years ?? 0,
        projectsCompleted: dto.projectsCompleted ?? user.experience?.projectsCompleted ?? 0,
        technologies: dto.technologies ?? user.experience?.technologies ?? [],
      };
    }

    // Обновление навыков
    if (dto.skills) {
      user.skills = dto.skills;
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
      select: [
        'id',
        'email',
        'firstname',
        'lastname',
        'telephone',
        'group',
        'avatarPath',
        'experience',
        'skills',
        'personalQualities',
        'roles',
        'status'
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
    const users = await this.userRepository.find();
    return users.map(user => {
      const { passwordHash, ...securedUser } = user;
      return securedUser;
    });
  }

  async update(id: number, updatedUserData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updatedUserData);
    return this.userRepository.save(user);
  }
}
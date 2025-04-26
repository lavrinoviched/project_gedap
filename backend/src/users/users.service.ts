import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, UpdateUserDto, UserAccountStatus, UpdateProfileDto, TechnologyName } from 'src/common/types';
import { User } from 'src/orm/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Authentication methods
  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    roles: Role[] = [Role.user],
    status = UserAccountStatus.pending,
    technologies: TechnologyName[] = []
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.roles = roles;
    user.status = status;

    if (technologies && technologies.length > 0) {
      user.experience = {
        years: 0,
        projectsCompleted: 0,
        technologies: technologies
      };
    }

    return this.userRepository.save(user);
  }

  // Profile management methods
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update basic fields
    if (dto.firstname) user.firstname = dto.firstname;
    if (dto.lastname) user.lastname = dto.lastname;
    if (dto.email) user.email = dto.email;
    if (dto.telephone) user.telephone = dto.telephone;
    if (dto.group) user.group = dto.group;

    // Update technologies
    if (dto.technologies) {
      user.experience = user.experience || { years: 0, projectsCompleted: 0 };
      user.experience.technologies = dto.technologies as TechnologyName[];
    }

    // Update experience
    if (dto.yearsOfExperience || dto.projectsCompleted) {
      user.experience = {
        years: dto.yearsOfExperience ?? user.experience?.years ?? 0,
        projectsCompleted: dto.projectsCompleted ?? user.experience?.projectsCompleted ?? 0,
      };
    }

    // Update personal qualities
    if (dto.communicationSkill || dto.teamworkSkill || dto.leadershipSkill || dto.reliabilitySkill) {
      user.personalQualities = {
        communication: dto.communicationSkill ?? user.personalQualities?.communication ?? 0,
        teamwork: dto.teamworkSkill ?? user.personalQualities?.teamwork ?? 0,
        leadership: dto.leadershipSkill ?? user.personalQualities?.leadership ?? 0,
        reliability: dto.reliabilitySkill ?? user.personalQualities?.reliability ?? 0,
      };
    }

    // Update avatar
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
        'personalQualities',
        'roles',
        'status',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Для админа возвращаем только базовую информацию
    if (user.roles.includes(Role.admin)) {
      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        telephone: user.telephone,
        roles: user.roles,
        status: user.status,
      };
    }

    return user;
  }

  // Technology methods
  async addTechnologiesToUser(userId: number, techNames: TechnologyName[]): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.experience = user.experience || { years: 0, projectsCompleted: 0, technologies: [] };
    const existingTech = user.experience.technologies || [];

    // Add only new technologies, avoiding duplicates
    const newTechnologies = techNames.filter(
      tech => !existingTech.includes(tech)
    );

    user.experience.technologies = [...existingTech, ...newTechnologies];
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async removeTechnologiesFromUser(userId: number, techNames: TechnologyName[]): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.experience?.technologies) {
      user.experience.technologies = user.experience.technologies.filter(
        tech => !techNames.includes(tech)
      );
    }

    return this.userRepository.save(user);
  }

  // Admin methods
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

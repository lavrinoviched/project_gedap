export enum Role {
  admin = 'admin',
  user = 'user',
  customer = 'customer',
}

export enum UserCommandStatus {
  inTeam = 'In the team',
  expelled = 'Expelled',
}
    
export enum StatusProject {
  searchTeam = 'Search for team',
  teamFound = 'Team found',
}
    
export enum StatusIdea {
  new = 'New',
  underEditing = 'Under Editing',
  underApproval = 'Under Approval',
  approved = 'Approved',
  published = 'Published',
}
    
export enum StatusTeam {
  searchProject = 'Search for a project',
  inProgress = 'In progress',
}
    
export enum PrivacyTeam {
  open = 'Open',
  close = 'Close',
}
    
export enum Competence {
  no = 'No',
  html = 'HTML',
  typescript = 'TypeScript',
  postgresql = 'PostgreSQL',
}

export enum UserAccountStatus {
  active = 'active',
  pending = 'pending',
  inactive = 'inactive',
}

export enum TaskStatus {
  new = 'new',
  inProgress = 'inProgress',
  done = 'done',
}

export interface LoginResponseDto {
  userId: number;
  access_token: string;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  avatarPath?: string;
}

export interface SignUpRequestDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface SignupResponseDto {
  success: boolean;
}

export interface CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  roles: Role[];
  status: UserAccountStatus;
  avatarPath?: string;
  experience?: {
    years: number;
    projectsCompleted: number;
    technologies?: string[];
  };
  skills?: string[];
  personalQualities?: {
    communication: number;
    teamwork: number;
    leadership: number;
    reliability: number;
  };
}

export type UpdateUserDto = Omit<CreateUserDto, 'password'> & {
  id: number;
};

export type SecuredUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  status: UserAccountStatus;
  avatarPath?: string;
  experience?: {
    years: number;
    projectsCompleted: number;
    technologies?: string[];
  };
  skills?: string[];
  personalQualities?: {
    communication: number;
    teamwork: number;
    leadership: number;
    reliability: number;
  };
  group?: string;
  telephone?: string;
};

export type TaskDto = {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  author: SecuredUser;
  assignee?: SecuredUser;
};

export type CreateUpdateTaskDto = Omit<TaskDto, 'id' | 'createdAt' | 'author'> & {
  authorId: number;
  assigneeId?: number;
};

export type UpdateProfileDto = {
  email?: string;
  firstname?: string;
  lastname?: string;
  telephone?: string;
  group?: string;
  avatarPath?: string;
  yearsOfExperience?: number;
  projectsCompleted?: number;
  technologies?: string[];
  skills?: string[];
  communicationSkill?: number;
  teamworkSkill?: number;
  leadershipSkill?: number;
  reliabilitySkill?: number;
};
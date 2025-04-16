import { IsEnum } from 'class-validator';

export enum ApplicationStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export class ApplicationResponseDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  comment?: string;
}
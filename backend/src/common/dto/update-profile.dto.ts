import { IsOptional, IsNumber, IsArray, IsString } from 'class-validator';
import { TechnologyName } from 'src/common/types';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    telephone?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsString()
    avatarPath?: string;

    @IsOptional()
    @IsNumber()
    yearsOfExperience?: number;

    @IsOptional()
    @IsNumber()
    projectsCompleted?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    technologies?: TechnologyName[];

    @IsOptional()
    @IsNumber()
    communicationSkill?: number;

    @IsOptional()
    @IsNumber()
    teamworkSkill?: number;

    @IsOptional()
    @IsNumber()
    leadershipSkill?: number;
    
    @IsOptional()
    @IsNumber()
    reliabilitySkill?: number;
}
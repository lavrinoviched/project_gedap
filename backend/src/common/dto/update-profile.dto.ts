import { IsOptional, IsNumber, IsArray, IsString } from 'class-validator';

export class UpdateProfileDto {
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
    skills?: string[];

    @IsOptional()
    @IsNumber()
    communicationSkill?: number;

    @IsOptional()
    @IsNumber()
    teamworkSkill?: number;

    @IsOptional()
    @IsNumber()
    leadershipSkill?: number;
    
}


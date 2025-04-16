import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsEmail, IsPhoneNumber, MinLength, IsNumber, IsOptional } from 'class-validator';

@Entity()
export class ApplicationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @MinLength(5, { message: 'Название проекта должно содержать минимум 5 символов' })
  projectName: string;

  @Column({ type: 'text' })
  @MinLength(200, { message: 'Описание проекта должно содержать минимум 200 символов' })
  description: string;

  @Column()
  @IsEmail()
  contactEmail: string;

  @Column()
  @IsPhoneNumber('RU')
  contactPhone: string;

  @Column({ type: 'date' })
  desiredDeadline: Date;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  files?: string[];

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  comments?: string;

  @Column({ type: 'decimal', nullable: true })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'draft' })
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}
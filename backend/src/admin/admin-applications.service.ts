import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../orm/application.entity';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { MailerService } from '../application/mailer.service';

@Injectable()
export class AdminApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly mailerService: MailerService,
  ) {}

  async getAllApplications(): Promise<Application[]> {
    return this.applicationRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'], // Добавьте связи, если они есть
    });
  }

  async getApplicationById(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['user'], // Добавьте связи, если они есть
    });

    if (!application) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    return application;
  }

  async updateApplicationStatus(
    id: number,
    responseDto: ApplicationResponseDto,
  ): Promise<Application> {
    const application = await this.getApplicationById(id);

    application.status = responseDto.status;
    application.adminComment = responseDto.comment || null;

    const updatedApplication = await this.applicationRepository.save(application);
    await this.sendStatusNotification(updatedApplication, responseDto.comment);

    return updatedApplication;
  }

  private async sendStatusNotification(
    application: Application,
    adminComment?: string,
  ): Promise<void> {
    if (!['approved', 'rejected'].includes(application.status)) {
      return;
    }

    const emailData = this.prepareEmailContent(application, adminComment);
    
    try {
      await this.mailerService.sendMail(
        application.email,
        emailData.subject,
        emailData.text,
      );
    } catch (error) {
      console.error('Ошибка при отправке уведомления:', error);
    }
  }

  private prepareEmailContent(
    application: Application,
    adminComment?: string,
  ): { subject: string; text: string } {
    const templates = {
      approved: {
        subject: 'Ваша заявка одобрена',
        text: `Здравствуйте, ${application.name}!\n\n` +
              `Ваша заявка №${application.id} одобрена.\n` +
              (adminComment ? `Комментарий администратора: ${adminComment}\n\n` : '\n') +
              `Дополнительные инструкции будут отправлены вам отдельным письмом.`,
      },
      rejected: {
        subject: 'Ваша заявка отклонена',
        text: `Здравствуйте, ${application.name}!\n\n` +
              `Ваша заявка №${application.id} отклонена.\n` +
              (adminComment ? `Причина: ${adminComment}\n\n` : '\n') +
              `Вы можете подать новую заявку или обратиться в поддержку.`,
      },
    };

    return templates[application.status];
  }
}
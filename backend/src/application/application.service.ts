import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../orm/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { MailerService } from '../application/mailer.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private mailerService: MailerService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(application);
  }

  async approveApplication(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new Error('Заявка не найдена');
    }

    application.status = 'approved';
    await this.applicationRepository.save(application);

    // Отправка уведомления на почту
    await this.mailerService.sendMail(
      application.email,
      'Ваша заявка одобрена',
      'Здравствуйте, ${application.name}! Ваша заявка одобрена. Позже администраторы Вам отправят данные для входа на сайт.',
    );

    return application;
  }
}
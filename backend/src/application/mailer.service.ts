import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    // Настройка транспорта для отправки email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Используем Gmail
      auth: {
        user: 'alinagz0206@gmail.com', // Ваш email
        pass: 'alinazzz', // Ваш пароль или app-specific пароль
      },
    });
  }

  // Метод для отправки email
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'alinagz0206@gmail.com', // От кого
      to, // Кому (администратору)
      subject, // Тема письма
      text, // Текст письма
    };

    try {
      await this.transporter.sendMail(mailOptions); // Отправка email
      return { success: true, message: 'Email успешно отправлен!' };
    } catch (error) {
      console.error('Ошибка при отправке email:', error);
      return { success: false, message: 'Ошибка при отправке email.' };
    }
  }
}
import { 
    IsString, 
    IsNotEmpty, 
    Matches, 
    IsEmail, 
    Length 
} from 'class-validator';
import { IsValidFullName } from '../common/decorators/is-strong-password.decorator';

export class CreateApplicationDto {
    @IsValidFullName()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/^\+?\d{10,15}$/, {
        message: 'Телефон должен содержать 10-15 цифр, можно с + в начале'
    })
    phone: string;

    @IsEmail({}, {
        message: 'Неверный формат email'
    })
    email: string;

    @Length(10, 1000, {
        message: 'Комментарий должен содержать от 10 до 1000 символов'
    })
    @IsString()
    comment: string;
    
}
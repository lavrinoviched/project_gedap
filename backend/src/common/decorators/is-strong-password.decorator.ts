import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { CreateApplicationDto } from '../../dto/create-application.dto';

@ValidatorConstraint({ name: 'IsValidFullName', async: false })
export class IsValidFullNameConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return /^[а-яА-ЯёЁa-zA-Z]{2,}(?:\s[а-яА-ЯёЁa-zA-Z]{2,}){2}$/.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'ФИО должно содержать три слова (кириллица/латиница) по 2+ символа, разделённых пробелами';
    }
}

export function IsValidFullName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidFullNameConstraint
        });
    };
}

export function IsValidApplication(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidApplication',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const dto = args.object as CreateApplicationDto;
                    
                    const nameValid = new IsValidFullNameConstraint().validate(dto.name, args);
                    const phoneValid = /^\+?\d{10,15}$/.test(dto.phone);
                    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email);
                    const commentValid = dto.comment?.length >= 10;
                    
                    return nameValid && phoneValid && emailValid && commentValid;
                },
                defaultMessage(args: ValidationArguments) {
                    const dto = args.object as CreateApplicationDto;
                    const errors: string[] = [];
                    
                    if (!new IsValidFullNameConstraint().validate(dto.name, args)) {
                        errors.push('ФИО: требуется три слова по 2+ символа (кириллица/латиница)');
                    }
                    
                    if (!/^\+?\d{10,15}$/.test(dto.phone)) {
                        errors.push('Телефон: 10-15 цифр, можно с + в начале');
                    }
                    
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
                        errors.push('Email: неверный формат');
                    }
                    
                    if (!dto.comment || dto.comment.length < 10) {
                        errors.push('Комментарий: минимум 10 символов');
                    }
                    
                    return errors.join('; ');
                }
            }
        });
    };
}
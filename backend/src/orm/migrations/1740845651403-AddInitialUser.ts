import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialUser1740845651403 implements MigrationInterface {
    name = 'AddInitialUser1740845651403';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (
                email,
                "passwordHash",
                firstname,
                lastname,
                roles,
                status,
                "avatarPath",
                experience,
                technologies,
                "personalQualities",
                "group",
                telephone,
                "teamId"
            ) VALUES 
                ('robert@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Robert', 'Wilson', '{admin}', 'active', NULL, '3 years', '{TypeScript, Node.js}', '{Leadership, Communication}', 'ИСПб-24-1', '79225684392', NULL),
                ('daniel@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Daniel', 'Williams', '{user}', 'pending', NULL, '1 year', '{HTML, CSS}', '{Teamwork}', 'ИБКСб-24-1', '79225275801', NULL),
                ('john@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'John', 'Thomas', '{customer}', 'inactive', NULL, '5 years', '{PostgreSQL, Docker}', '{Analytical skills}', 'АСОиУб-24-1', '79220848224', NULL),
                ('william@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'William', 'Ross', '{expert}', 'inactive', NULL, '2 years', '{PostgreSQL, SQL}', '{Problem-solving}', 'РППб-24-1', '79224416809', NULL),
                ('scott@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Scott', 'Ortiz', '{directorate}', 'active', NULL, '4 years', '{TypeScript, React}', '{Decision-making}', 'ПКТб-24-1', '79227870709', NULL)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE email IN ('robert@example.com', 'daniel@example.com', 'john@example.com', 'william@example.com', 'scott@example.com')
        `);
    }
}
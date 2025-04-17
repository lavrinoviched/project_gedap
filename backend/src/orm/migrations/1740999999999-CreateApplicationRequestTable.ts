import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateApplicationRequestTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'application_request',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true },
          { name: 'projectName', type: 'varchar', length: '255' },
          { name: 'description', type: 'text' },
          { name: 'contactEmail', type: 'varchar' },
          { name: 'contactPhone', type: 'varchar' },
          { name: 'desiredDeadline', type: 'date' },
          { name: 'files', type: 'jsonb', isNullable: true },
          { name: 'comments', type: 'text', isNullable: true },
          { name: 'budget', type: 'decimal', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'status', type: 'varchar', default: "'draft'" },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('application_request');
  }
}
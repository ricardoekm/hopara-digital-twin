import {MigrationInterface, QueryRunner} from 'typeorm'

export class appTableAddSchemaField1661351872942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps ADD schema text NULL;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps DROP COLUMN schema;
        `)
  }
}

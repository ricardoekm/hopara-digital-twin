import {MigrationInterface, QueryRunner} from 'typeorm'

export class appHistoryTableAddSchemaField1661524032680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history ADD schema text NULL;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history DROP COLUMN schema;
        `)
  }
}

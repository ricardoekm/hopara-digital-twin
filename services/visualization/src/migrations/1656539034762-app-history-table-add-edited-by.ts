import {MigrationInterface, QueryRunner} from 'typeorm'

export class appHistoryTableAddEditedBy1656539034762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history ADD edited_by varchar(255) NULL;
            ALTER TABLE hp_apps_history ADD edited_at timestamp NULL;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history DROP COLUMN edited_by;
            ALTER TABLE hp_apps_history DROP COLUMN edited_at;
        `)
  }
}

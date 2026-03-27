import {MigrationInterface, QueryRunner} from 'typeorm'

export class appHistoryTableAddFkCascade1659360966808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history
            ADD CONSTRAINT hp_apps_history_fk FOREIGN KEY (id)
            REFERENCES hp_apps(id)
            ON DELETE CASCADE;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps_history
            DROP CONSTRAINT hp_apps_history_fk;
        `)
  }
}

import {MigrationInterface, QueryRunner} from 'typeorm'

export class appTableAddVisualizations1656370613028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps ADD visualizations text NOT NULL DEFAULT '[]';
            ALTER TABLE hp_apps ADD version int NOT NULL DEFAULT 1;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps
            DROP COLUMN visualization;
        `)
  }
}

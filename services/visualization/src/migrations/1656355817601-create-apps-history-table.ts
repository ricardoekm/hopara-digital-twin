import {MigrationInterface, QueryRunner} from 'typeorm'

export class createAppsHistoryTable1656355817601 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE hp_apps_history(
              id varchar(255) NOT NULL,
              name varchar(255) NULL,
              image_url text NULL,
              visualizations text NOT NULL DEFAULT '[]',
              version int NOT NULL DEFAULT 1,
              CONSTRAINT hp_apps_history_pkey PRIMARY KEY (id,version)
        )`)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE hp_apps_history`)
  }
}

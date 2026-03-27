import {MigrationInterface, QueryRunner} from 'typeorm'

export class deletePreferencesTable1653599042664 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE hp_preferences`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE hp_preferences (
            id varchar(255),
            visualization_id varchar(255),
            app_id varchar(255),
            content text NOT NULL,
            PRIMARY KEY(id, visualization_id, app_id),
            CONSTRAINT fk_app FOREIGN KEY(app_id) REFERENCES hp_apps(id) ON DELETE CASCADE
        );`)
  }
}

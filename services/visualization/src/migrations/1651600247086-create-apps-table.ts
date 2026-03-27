import {QueryRunner} from 'typeorm'

export class CreateAppsTable1651600247086 {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE hp_apps(
            id character varying(255) NOT NULL,
            content text,
            PRIMARY KEY (id)
        )`)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE hp_apps`)
  }
}

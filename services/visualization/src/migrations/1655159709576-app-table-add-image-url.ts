import {MigrationInterface, QueryRunner} from 'typeorm'

export class appTableAddImageUrl1655159709576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps ADD image_url text NULL;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE hp_apps
            DROP COLUMN image_url;
        `)
  }
}

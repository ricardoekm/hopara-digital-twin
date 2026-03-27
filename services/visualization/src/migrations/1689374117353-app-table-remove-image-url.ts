import { MigrationInterface, QueryRunner } from 'typeorm'

export class appTableRemoveImageUrl1689374117353 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_apps DROP COLUMN image_url;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_apps ADD COLUMN image_url text NULL;
        `)
    }
}

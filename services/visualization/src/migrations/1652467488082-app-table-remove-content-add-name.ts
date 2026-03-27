import {QueryRunner} from 'typeorm'

export class AppTableRemoveContentAddName1652467488082 {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_apps DROP COLUMN "content";
            ALTER TABLE hp_apps ADD "name" varchar(255);
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_apps DROP COLUMN "name";
            ALTER TABLE hp_apps ADD "content" text NOT NULL;
        `)
    }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class VisualizationTableRenameIdToIndex1652966603074 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_visualizations RENAME COLUMN visualization_id TO "index";
            ALTER TABLE hp_visualizations ALTER COLUMN "index" TYPE int USING "index"::int;
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_visualizations ALTER COLUMN "index" TYPE varchar(255) USING "index"::varchar(255);
            ALTER TABLE hp_visualizations RENAME COLUMN "index" TO visualization_id;
        `)
    }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class VisualizationTableAddFk1653083598917 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_visualizations
            ADD CONSTRAINT hp_visualizations_fk FOREIGN KEY (app_id)
            REFERENCES hp_apps(id)
            ON DELETE CASCADE;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE hp_visualizations
            DROP CONSTRAINT hp_visualizations_fk;
        `)
    }
}

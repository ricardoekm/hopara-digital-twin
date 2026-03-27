import {QueryRunner} from 'typeorm'

export class CreateVisualizationTable1652465014977 {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE hp_visualizations (
                app_id varchar(255) NOT NULL,
                visualization_id varchar(255) NOT NULL,
                layers text NOT NULL,
                data_browsers text NOT NULL,
                filters text NOT NULL,
                "content" text NOT NULL,
                CONSTRAINT hp_visualizations_pk PRIMARY KEY (app_id,visualization_id)
            )
        `)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE hp_visualizations`)
    }
}

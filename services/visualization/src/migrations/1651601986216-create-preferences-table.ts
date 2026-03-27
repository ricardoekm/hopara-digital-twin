import {QueryRunner} from 'typeorm'

export class CreatePreferencesTable1651601986216 {
    async up(queryRunner: QueryRunner): Promise<void> {
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

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE hp_preferences')
    }
}

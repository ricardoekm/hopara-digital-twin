DO $$
BEGIN
    BEGIN
        DELETE FROM hp_columns WHERE view_id = 'hopara#buildings';
        DELETE FROM hp_views WHERE id = 'hopara#buildings';
        INSERT INTO hp_views(id, data_source_name, write_table_name, primary_key_name, name, query, filter_tables, write_level, smart_load, row_count, upsert, editable_columns, view_join)
        VALUES ('hopara#buildings', 'hopara', null, 'id', 'buildings', 'SELECT id, name, st_orientedenvelope(geom) bounding_box, geom from buildings', true, 'NONE', false, 623774, false, '[]', null);
        INSERT INTO hp_columns (name, type, view_id, top_values, min_x, max_x, min_y, max_y, percentiles) VALUES ('id', 'INTEGER', 'hopara#buildings', null, null, null, null, null, null);
        INSERT INTO hp_columns (name, type, view_id, top_values, min_x, max_x, min_y, max_y, percentiles) VALUES ('name', 'STRING', 'hopara#buildings', '{Casa,Edificação,Banco do Brasil,Atem,Shell,Caixa Econômica Federal,Salão do Reino das Testemunhas d,Correios,Posto Atem,Bradesco,Ipiranga,Assembléia de Deus,Assembleia de Deus,BR,Lojas Americanas,Posto BR,Instituto Caruanas do Marajó,Igreja Universal do Reino de Deu,Posto Shell,Banco da Amazônia}', null, null, null, null, null);
        INSERT INTO hp_columns (name, type, view_id, top_values, min_x, max_x, min_y, max_y, percentiles) VALUES ('bounding_box', 'GEOMETRY', 'hopara#buildings', null, null, null, null, null, null);
        INSERT INTO hp_columns (name, type, view_id, top_values, min_x, max_x, min_y, max_y, percentiles) VALUES ('geom', 'GEOMETRY', 'hopara#buildings', null, null, null, null, null, null);
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
END $$;
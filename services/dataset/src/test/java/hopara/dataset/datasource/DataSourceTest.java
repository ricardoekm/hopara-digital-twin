package hopara.dataset.datasource;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class DataSourceTest {
    @Test
    void getSchemas() {
        var dataSource = new DataSource();
        dataSource.setSchema("hopara_io,public");

        var schemas = dataSource.getSchemas();
        assertEquals("hopara_io", schemas.get(0));
        assertEquals("public", schemas.get(1));
    }

    @Test
    void replace_kyrix_by_hopara_in_database_name() {
        var dataSource = new DataSource();
        dataSource.setDatabase("kyrix");

        assertEquals("hopara", dataSource.getDatabase());
    }
}

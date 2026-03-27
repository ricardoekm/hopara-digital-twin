package hopara.dataset.datasource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.NotFoundException;
import hopara.dataset.database.DatabaseType;

public class DataSourceRepositoryTest extends IntegrationTest {
    
    @Autowired
    DataSourceRepository datasourceRepository;
     
    @Test
    void get_data_source() {
        var datasource = new DataSource();
        datasource.setName("test_ds");
        datasource.setUsername("username");
        datasource.setPassword("kyrix");
        datasource.setDatabase("database");
        datasource.setPort(123);
        datasource.setHost("server");
        datasource.setSchema("hopara");
        datasource.setType(DatabaseType.POSTGRES);
        datasource.setMaxConnections(2);
        datasource.setQuoteIdentifiers(true);
        datasource.setAnnotation("js function");

        datasourceRepository.save(datasource);
        
        var fetchedDataSource = datasourceRepository.findByName("test_ds");
        assertEquals(datasource, fetchedDataSource);
    }

    @Test
    void update_data_source() {
        var datasource = new DataSource();
        datasource.setName("test_ds");
        datasource.setUsername("username");
        datasource.setPassword("kyrix");
        datasource.setDatabase("database");
        datasource.setPort(123);
        datasource.setHost("server");
        datasource.setSchema("hopara");
        datasource.setType(DatabaseType.POSTGRES);
        datasource.setMaxConnections(2);
        
        datasourceRepository.save(datasource);

        var updatedDataSource = new DataSource();
        updatedDataSource.setName("test_ds");
        updatedDataSource.setUsername("username1");
        updatedDataSource.setDatabase("database1");
        updatedDataSource.setPassword("kyrix");
        updatedDataSource.setPort(1234);
        updatedDataSource.setHost("server1");
        updatedDataSource.setSchema("hopara1");
        updatedDataSource.setType(DatabaseType.POSTGRES);
        updatedDataSource.setMaxConnections(3);

        datasourceRepository.save(updatedDataSource);

        var fetchedDataSource = datasourceRepository.findByName("test_ds");
        assertEquals(updatedDataSource, fetchedDataSource);
    }
    
    @Test
    void if_not_found_throws_exception() {
        assertThrows(NotFoundException.class, () -> datasourceRepository.findByName("any"));
    }
}

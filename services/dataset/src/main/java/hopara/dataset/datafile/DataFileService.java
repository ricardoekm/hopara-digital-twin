package hopara.dataset.datafile;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseType;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.web.TenantService;

@Component
public class DataFileService {
    
    @Autowired
    DataFileRepository dataFileRepository;
    
    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    TenantService tenantService;

    @Autowired
    DataFileTableRepository tableRepository;

    @Autowired
    Database database;

    @Value("${dataFiles.dir}")
    String baseDir;

    private DataFilePath getPath() {
        return new DataFilePath(baseDir, tenantService.getTenant(), dataSourceRepository.getCurrentName());
    }

    @CacheEvict(cacheNames={DataFileTableRepository.CACHE_NAME}, allEntries=true)
    public DataFile save(String name, MultipartFile multipartFile) throws IOException {
        var dataFile = new DataFile(name, multipartFile.getOriginalFilename(), getPath());
        dataFile.setInputStream(multipartFile.getInputStream());
        dataFile.setFileSize(multipartFile.getSize());
        dataFileRepository.save(dataFile);

        return dataFile;
    }

    public void loadTables(SqlQuery query) {
        if ( !database.isType(DatabaseType.DUCKDB) ) {
            return;
        }

        for ( var table : query.getTableNames() ) {
            tableRepository.refresh(table, getPath());
        }
    }

    public DataFiles list() {
       return dataFileRepository.list(getPath());
    }

    public FileContent getContent(String name) {
        var dataFile = dataFileRepository.findByName(name, getPath());
        return dataFileRepository.getContent(dataFile);
    }

    public void delete(String name) {
        var dataFile = dataFileRepository.findByName(name, getPath());
        dataFileRepository.delete(dataFile);
    }
}

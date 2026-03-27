package hopara.dataset.datafile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import hopara.dataset.NotFoundException;

@Component
public abstract class DataFileTableRepository {
	public static final String CACHE_NAME = "dataFileTables";  	

    @Autowired
	@Qualifier("dataJdbcTemplate")
	private JdbcTemplate dataJdbcTemplate;

	@Autowired
	private DataFileRepository dataFileRepository;

    abstract protected Boolean requireInstall();
    abstract protected String getInstallStatement();
	abstract protected String getFilePath(DataFile dataFile);

    private String getSpatialInstallStatement() {
        return "INSTALL spatial; LOAD spatial;";
    }

    protected String getReadFileStatement(DataFile dataFile) {
		var baseFile = "'" + getFilePath(dataFile) + "'";
		if ( dataFile.hasExtension("csv") ) {
			return "read_csv_auto(" + baseFile + ", header=true)";
		}

		return baseFile;
	}

    private void doCreate(DataFile dataFile) {
        if ( requireInstall() ) {
            dataJdbcTemplate.update(getInstallStatement());
        }
        dataJdbcTemplate.update(getSpatialInstallStatement());

		var sql = "CREATE OR REPLACE TEMP TABLE " + dataFile.getName();
		sql += " AS SELECT * FROM " + getReadFileStatement(dataFile);
    
        dataJdbcTemplate.update(sql);
    }

	public void create(DataFile dataFile) {
        try {
            doCreate(dataFile);
        } catch (Exception e) {
            if ( e instanceof UncategorizedSQLException ) {
                var sqlException = (UncategorizedSQLException)e;
                if ( StringUtils.hasText(CACHE_NAME) ) {
                    if ( sqlException.getMessage().contains("Invalid unicode (byte sequence mismatch)") ) {
                        throw new InvalidUnicodeException(e);
                    }
                }
            }

            throw e;
        }        
    }

    public void drop(DataFile dataFile) {
        var sql = "DROP TABLE IF EXISTS " + dataFile.getName();     
        
        dataJdbcTemplate.update(sql);
    }

	@Cacheable(CACHE_NAME)
	public void refresh(String name, DataFilePath path) {
        var dataFiles = dataFileRepository.list(path);
        var dataFile = dataFiles.findByName(name);
        if ( dataFile == null ) {
            throw new NotFoundException(name);
        }

        create(dataFile);
    }
}

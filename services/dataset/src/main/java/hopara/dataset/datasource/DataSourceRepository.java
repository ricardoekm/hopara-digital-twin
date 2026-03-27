package hopara.dataset.datasource;

import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import hopara.dataset.NotFoundException;
import hopara.dataset.cache.CustomCacheKeyProvider;
import hopara.dataset.datasource.password.PasswordRepository;
import hopara.dataset.web.TenantService;

@Component
public class DataSourceRepository implements CustomCacheKeyProvider {

    private Log logger = LogFactory.getLog(DataSourceRepository.class);

    public static final String CACHE_NAME = "dataSourceRepository";
    private static final ThreadLocal<String> currentNameMap =  new ThreadLocal<String>();
    private static String defaultName;

    @Value("${databaseServer}")
    private String localDatabaseServer;

    @Value("${env:dev}")
    private String env;

    @Autowired
    JdbcTemplate jdbcTemplate;
    
    @Autowired
    TenantService tenantService;
    
    @Autowired
    PasswordRepository passwordRepository;

    @Autowired
    NamedParameterJdbcTemplate namedJdbcTemplate;
    
    @Autowired
    SimpleJdbcInsert simpleJdbcInsert;
    
    @PostConstruct
    public void configInsert() {
        var columns = new String[]{"name","username", "database", "server", "type", 
                                    "schema", "port", "max_connections", "quote_identifiers",
                                    "annotation"};

        simpleJdbcInsert.withTableName("hp_data_sources")
                        .withoutTableColumnMetaDataAccess()
                        .usingColumns(columns);
    }  
    
    @Cacheable(CACHE_NAME)
    @Transactional(readOnly = true)
    public Boolean currentExists() {
        try {
            getCurrent();
            return true;
        } catch(NotFoundException e) {
            return false;
        }
    }

    private void doDelete(DataSource dataSource) {
        jdbcTemplate.update("DELETE FROM hp_data_sources WHERE name = ?", dataSource.getName());
   
        try {
            passwordRepository.delete(dataSource.getName());
        } catch(Exception e) {
            logger.warn("Couldnt delete secret for data source " + dataSource.getName(), e);
        }

    }

    public void delete(DataSource dataSource) {
        if ( dataSource.isDefault() && !env.equalsIgnoreCase("dev")) {
            throw new IllegalArgumentException("Can't delete default data source");
        }

        doDelete(dataSource);
    }

    private HashMap<String, Object> getParams(DataSource dataSource) {
        var params = new HashMap<String,Object>();
        params.put("name", dataSource.getName());
        params.put("username", dataSource.getUsername());       
        params.put("database", dataSource.getDatabase());
        params.put("annotation", dataSource.getAnnotation());
        params.put("port", dataSource.getPort());
        params.put("server", dataSource.getHost());
        params.put("schema", dataSource.getSchema());
        params.put("quote_identifiers", dataSource.shouldQuoteIdentifiers());
        params.put("max_connections", dataSource.getMaxConnections());
        params.put("type", dataSource.getType().toString());
        return params;
    }
    
    private void doSave(DataSource dataSource) {        
        simpleJdbcInsert.execute(getParams(dataSource)); 
    }

    private void update(DataSource dataSource) {        
        var params = getParams(dataSource);
        var query = "UPDATE hp_data_sources SET username = :username, database = :database, port = :port, " + 
                    "server = :server, schema = :schema, max_connections = :max_connections, type = :type, annotation = :annotation " +
                    "WHERE name = :name";
        namedJdbcTemplate.update(query, params);    
    }

    @CacheEvict(cacheNames=CACHE_NAME, allEntries = true) 
    public void save(DataSource dataSource) { 
        if ( exists(dataSource.getName()) ) {
            update(dataSource);
        }
        else {
            doSave(dataSource);
        }
        
        if ( dataSource.requiresPassword() &&  dataSource.hasPassword() ) {
            passwordRepository.save(dataSource.getName(),dataSource.getPassword());
        }
    }

    
    public List<DataSource> list() {
        return jdbcTemplate.query("SELECT * FROM hp_data_sources ORDER BY name",new DataSourceRowMapper()); 
    }

    public void deleteAll() {
        for ( var dataSource : list() ) {
            doDelete(dataSource);
        }
    }

    private Boolean isDev(DataSource dataSource) {
        return "db".equals(dataSource.getHost()) || "localhost".equals(dataSource.getHost());
    }

    private void devWorkaround(DataSource dataSource) {
        // To allow swiching between docker and local env
        if ( env.equals("dev") && isDev(dataSource) ) {
            dataSource.setHost(localDatabaseServer);
        }
    }

    public String findPassword(String name) {
        return passwordRepository.find(name);
    }

    public DataSource findByName(String name) {
        var dataSource = findByNameWithoutPassword(name);

        if ( dataSource.requiresPassword() ) {
            dataSource.setPassword(findPassword(name));
        }
        
        return dataSource;
    }

    public void clone(String source, String target) {
        var dataSource = findByName(source);
        dataSource.setName(target);
        save(dataSource);
    }

    @Cacheable(CACHE_NAME)
    public DataSource findByNameWithoutPassword(String name) {
        // This method is called directly by the connection pool, so we'll manually prefix the tenant
        var dataSources = jdbcTemplate.query("SELECT * FROM " + tenantService.prefix("hp_data_sources") + " where name = ?", new DataSourceRowMapper(), name);
        if ( dataSources.size() == 0) {
            throw new NotFoundException(name);
        }

        var dataSource = dataSources.get(0);
        devWorkaround(dataSource);
        return dataSource;
    }

    public Boolean exists(String name) {
        try {
            findByNameWithoutPassword(name);
        } catch(NotFoundException e ) {
            return false;
        }
        
        return true;
    }

    public Boolean isCurrentSet() {
       return StringUtils.hasText(getCurrentName());
    }

    private void validateCurrentSet() {
        if ( !isCurrentSet() ) {
            var exception = new IllegalArgumentException("Data source parameter is required");
            logger.error("Tried to get a datasource without name", exception);
            throw exception;
        }
    }

    // We set the datasource name as cache key by using the custom cache key provider
    @Cacheable(CACHE_NAME)
    @Transactional(readOnly = true,noRollbackFor = {NotFoundException.class})
    public DataSource getCurrent() {
        validateCurrentSet();
        return findByNameWithoutPassword(getCurrentName());
    }

    @Cacheable(CACHE_NAME)
    @Transactional(readOnly = true,noRollbackFor = {NotFoundException.class})
    public DataSource getCurrentWithPassword() {
        validateCurrentSet();
        return findByName(getCurrentName());
    }

    public String getCurrentName() {
        var currentName = currentNameMap.get();
        if ( currentName == null ) {
            return defaultName;
        }
       return currentName;
    }

    public void setCurrentName(String name) {
        currentNameMap.set(name);
    }

    @Override
    public String getKey() {
        return getCurrentName();
    }

    public static void setDefaultName(String defaultName) {
        DataSourceRepository.defaultName = defaultName;
    }
}

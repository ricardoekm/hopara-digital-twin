package hopara.dataset.database;

import org.locationtech.jts.io.WKTReader;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.Converter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.converter.duckdb.DuckGeometryConverter;
import hopara.dataset.row.converter.duckdb.DuckJsonConverter;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;
import hopara.dataset.row.read.condition.duckdb.DuckGeometryConditionBuilder;

public class DuckDb extends PostgresClass {
    String tenant;

    public DuckDb(String tenant) {
        this.tenant = tenant;
    }

    @Override
    public String getSqlOperator(Operator operator) {
        if ( operator == Operator.MAKE_POINT ) {
            return "ST_Point";
        }
        
        return super.getSqlOperator(operator);
    }

    private String getFilePath() {
        return System.getProperty("java.io.tmpdir") + "/" + tenant + "_v1_2";
    }

    @Override
    public String getJdbcUrl(DataSource dataSource) {
        return "jdbc:duckdb:" + getFilePath();
    }

    @Override
    public String getTestJdbcUrl(DataSource dataSource) {
        return getJdbcUrl(dataSource);
    }

    @Override
    public String getDriverClass() {
        return "org.duckdb.DuckDBDriver";
    }

    @Override
    public DatabaseType getType() {
        return DatabaseType.DUCKDB;
    }

    public ObjectMapper getObjectMapper() {
        var objectMapper = new ObjectMapper();
        objectMapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);
        return objectMapper;
    }

    @Override
    public Converter getJsonConverter() {
        return new DuckJsonConverter(getObjectMapper());
    }
    
    @Override
    public GeometryConditionBuilder getGeometryConditionBuilder() {
        return new DuckGeometryConditionBuilder(getGeometryConverter(), this);
    }

    @Override
    public GeometryConverter getGeometryConverter() {
        return new DuckGeometryConverter(new WKTReader());
    }

    @Override
    public Boolean supportSrid() {
        return false;
    }
}

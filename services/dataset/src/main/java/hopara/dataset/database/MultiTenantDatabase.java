package hopara.dataset.database;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.ColumnType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.row.converter.BooleanConverter;
import hopara.dataset.row.converter.Converter;
import hopara.dataset.row.converter.DateConverter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.converter.StringConverter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;
import hopara.dataset.row.read.condition.BooleanConditionBuilder;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;
import hopara.dataset.row.read.condition.NumericConditionBuilder;
import hopara.dataset.row.read.condition.StringConditionBuilder;
import hopara.dataset.row.read.condition.TemporalConditionBuilder;

public class MultiTenantDatabase implements Database {
    
    @Autowired
    DatabaseRepository databaseRepository;
    
    public Database getDatabase() {
        return databaseRepository.getDatabase();
    }
    
    @Override
    public String getJdbcUrl(DataSource dataSource) {
        return getDatabase().getJdbcUrl(dataSource);
    }

    public String getDriverClass() {
        return getDatabase().getDriverClass();
    }

    @Override
    public Integer getDefaultPort() {
        return getDatabase().getDefaultPort();
    }

    @Override
    public Converter getJsonConverter() {
        return getDatabase().getJsonConverter();
    }

    @Override
    public Boolean supportArray() {
        return getDatabase().supportArray();
    }

    public String getSqlType(ColumnType columnType) {
        return getDatabase().getSqlType(columnType);
    }

    public String getSqlOperator(Operator comparisonType) {
        return getDatabase().getSqlOperator(comparisonType);
    }

    public DatabaseType getType() {
        return getDatabase().getType();
    }

    public DatabaseClass getDbClass() {
        return getDatabase().getDbClass();
    }

    @Override
    public ArrayConverter getArrayConverter() {
        return getDatabase().getArrayConverter();
    }

    @Override
    public ArrayConverter getNumberArrayConverter() {
        return getDatabase().getNumberArrayConverter();
    }

    @Override
    public GeometryConverter getGeometryConverter() {
        return getDatabase().getGeometryConverter();
    }

    @Override
    public BooleanConverter getBooleanConverter() {
        return getDatabase().getBooleanConverter();
    }

    @Override
    public ArrayConditionBuilder getArrayConditionBuilder() {
        return getDatabase().getArrayConditionBuilder();
    }

    @Override
    public GeometryConditionBuilder getGeometryConditionBuilder() {
        return getDatabase().getGeometryConditionBuilder();
    }

    @Override
    public NumericConditionBuilder getNumericConditionBuilder() {
        return getDatabase().getNumericConditionBuilder();
    }

    @Override
    public BooleanConditionBuilder getBooleanConditionBuilder() {
        return getDatabase().getBooleanConditionBuilder();
    }

    @Override
    public DateConverter getDateConverter() {
        return getDatabase().getDateConverter();
    }

    @Override
    public StringConverter getStringConverter() {
        return  getDatabase().getStringConverter();
    }

    @Override
    public String getTestJdbcUrl(DataSource dataSource) {
        return getDatabase().getTestJdbcUrl(dataSource);
    }

    @Override
    public StringConditionBuilder getStringConditionBuilder() {
        return getDatabase().getStringConditionBuilder();
    }

    @Override
    public TemporalConditionBuilder getTemporalConditionBuilder() {
        return getDatabase().getTemporalConditionBuilder();
    }

    @Override
    public Boolean isType(DatabaseType databaseType) {
        return getDatabase().isType(databaseType);
    }

    @Override
    public Boolean isClass(DatabaseClass databaseClass) {
        return getDatabase().isClass(databaseClass);
    }

    @Override
    public Boolean supportSrid() {
        return getDatabase().supportSrid();
    }
}

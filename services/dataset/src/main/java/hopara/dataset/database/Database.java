package hopara.dataset.database;

import hopara.dataset.column.ColumnType;
import hopara.dataset.row.converter.Converter;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.row.converter.BooleanConverter;
import hopara.dataset.row.converter.DateConverter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.converter.StringConverter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;
import hopara.dataset.row.read.condition.BooleanConditionBuilder;
import hopara.dataset.row.read.condition.TemporalConditionBuilder;
import hopara.dataset.row.read.condition.NumericConditionBuilder;
import hopara.dataset.row.read.condition.StringConditionBuilder;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;

public interface Database {
    public String getJdbcUrl(DataSource dataSource);
    public String getTestJdbcUrl(DataSource dataSource);

    
    public String getDriverClass();
        
    public String getSqlType(ColumnType columnType);  
    public String getSqlOperator(Operator comparisonType);
    public DatabaseType getType();
    public DatabaseClass getDbClass();
    
    public ArrayConverter getArrayConverter();
    public ArrayConverter getNumberArrayConverter();
    public GeometryConverter getGeometryConverter();
    public BooleanConverter getBooleanConverter();
    public DateConverter getDateConverter();
    public Converter getJsonConverter();
    public StringConverter getStringConverter();
    public abstract Integer getDefaultPort();
    
    public ArrayConditionBuilder getArrayConditionBuilder();
    public GeometryConditionBuilder getGeometryConditionBuilder();
    public StringConditionBuilder getStringConditionBuilder();
    public TemporalConditionBuilder getTemporalConditionBuilder();
    public NumericConditionBuilder getNumericConditionBuilder();
    public BooleanConditionBuilder getBooleanConditionBuilder();
    
    public Boolean isType(DatabaseType databaseType);
    public Boolean isClass(DatabaseClass databaseClass);
    public Boolean supportArray();
    public Boolean supportSrid();

}

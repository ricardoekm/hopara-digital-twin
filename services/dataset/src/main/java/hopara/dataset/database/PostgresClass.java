package hopara.dataset.database;

import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.row.converter.BooleanConverter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.converter.StringConverter;
import hopara.dataset.row.converter.postgres.PostgresArrayConverter;
import hopara.dataset.row.converter.postgres.PostgresBooleanConverter;
import hopara.dataset.row.converter.postgres.PostgresGeometryConverter;
import hopara.dataset.row.converter.postgres.PostgresNumberArrayConverter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;
import hopara.dataset.row.read.condition.postgres.PostgresArrayConditionBuilder;
import hopara.dataset.row.read.condition.postgres.PostgresGeometryConditionBuilder;

public abstract class PostgresClass extends BaseDatabase {
    @Override
    public String getSqlOperator(Operator comparisonType) {
        if ( comparisonType == Operator.PARTIAL_MATCH ) {
            return "ILIKE";
        }
        
        return comparisonType.getSqlOperator();
    }

    @Override
    public Integer getDefaultPort() {
        return 5432;
    }
    
    @Override
    public DatabaseClass getDbClass() {
        return DatabaseClass.POSTGRES;
    }
    
    @Override
    public ArrayConverter getArrayConverter() {
        return new PostgresArrayConverter();
    }

    @Override
    public ArrayConverter getNumberArrayConverter() {
        return new PostgresNumberArrayConverter();
    }

    @Override
    public GeometryConverter getGeometryConverter() {
        return new PostgresGeometryConverter();
    }

    @Override
    public BooleanConverter getBooleanConverter() {
        return new PostgresBooleanConverter();
    }
    
    @Override
    public ArrayConditionBuilder getArrayConditionBuilder() {
        return new PostgresArrayConditionBuilder(getStringConditionBuilder());
    }

    @Override
    public GeometryConditionBuilder getGeometryConditionBuilder() {
        return new PostgresGeometryConditionBuilder(getGeometryConverter(), this);
    }

    @Override
    public StringConverter getStringConverter() {
        return new StringConverter();
    }

    @Override
    public Boolean supportArray() {
        return true;
    }

    @Override
    public Boolean supportSrid() {
        return true;
    }
}

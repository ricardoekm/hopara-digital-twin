package hopara.dataset.database;

import org.locationtech.jts.io.WKTReader;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.column.ColumnType;
import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.row.converter.BooleanConverter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.converter.StringConverter;
import hopara.dataset.row.converter.mysql.MySqlArrayConverter;
import hopara.dataset.row.converter.mysql.MySqlBooleanConverter;
import hopara.dataset.row.converter.mysql.MySqlGeometryConverter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;
import hopara.dataset.row.read.condition.mysql.MySqlArrayConditionBuilder;
import hopara.dataset.row.read.condition.mysql.MySqlGeometryConditionBuilder;

public abstract class MySqlClass extends BaseDatabase {  
    @Override
    public Integer getDefaultPort() {
        return 5432;
    }

    @Override
    public String getSqlType(ColumnType columnType) {
        if (columnType == ColumnType.STRING_ARRAY) {
            return "JSON";
        } else if (columnType == ColumnType.GEOMETRY) {
            return "GEOGRAPHY";
        }
        else if ( columnType == ColumnType.AUTO_INCREMENT ) {
            return "INT AUTO_INCREMENT"; 
        }

        return columnType.getSqlType();
    }
    
    public String getSqlOperator(Operator comparisonType) {
        if ( comparisonType == Operator.INTERSECTS ) {
            return "APPROX_GEOGRAPHY_INTERSECTS";
        }
        
        return comparisonType.getSqlOperator();
    }
    
    @Override
    public DatabaseClass getDbClass() {
        return DatabaseClass.MYSQL;
    }
    
    @Override
    public ArrayConverter getArrayConverter() {
        return new MySqlArrayConverter(new ObjectMapper());
    }

    @Override
    public ArrayConverter getNumberArrayConverter() {
        return new MySqlArrayConverter(new ObjectMapper());
    }

    @Override
    public GeometryConverter getGeometryConverter() {
        return new MySqlGeometryConverter(new WKTReader());
    }

    @Override
    public BooleanConverter getBooleanConverter() {
        return new MySqlBooleanConverter();
    }
    
    @Override
    public ArrayConditionBuilder getArrayConditionBuilder() {
        return new MySqlArrayConditionBuilder();
    }

    @Override
    public GeometryConditionBuilder getGeometryConditionBuilder() {
        return new MySqlGeometryConditionBuilder(getGeometryConverter(), this);
    }

    @Override
    public StringConverter getStringConverter() {
        return new StringConverter();
    }

    @Override
    public Boolean supportArray() {
        return false;
    }
}

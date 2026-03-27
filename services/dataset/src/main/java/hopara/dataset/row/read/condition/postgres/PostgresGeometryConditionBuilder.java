package hopara.dataset.row.read.condition.postgres;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;

public class PostgresGeometryConditionBuilder extends GeometryConditionBuilder {
    public PostgresGeometryConditionBuilder(GeometryConverter polygonConverter, Database database) {
        super(polygonConverter, database);
    }

    @Override
    protected String getValueCondition(Filter filter, String paramName, String tableName) {
        var operator = database.getSqlOperator(filter.getComparisonType());
        var column = filter.getSqlColumn();

        var sridSelect = "ST_SRID(" + column + ")";
        if ( "buildings".equals(tableName) ) {
            // For large tables known to be in the same SRID we'll use a faster method
            sridSelect = "(SELECT COALESCE(St_srid(" + column + "),0) as srid from " + tableName + " WHERE " + column + " IS NOT NULL LIMIT 1)";
        }

        return operator + "(" + column + ",ST_SetSRID(ST_GeometryFromText(:" + paramName + "), " + sridSelect + "))";
    }
}

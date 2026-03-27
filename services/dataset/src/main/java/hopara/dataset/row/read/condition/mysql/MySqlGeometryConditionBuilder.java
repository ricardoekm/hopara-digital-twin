package hopara.dataset.row.read.condition.mysql;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;

public class MySqlGeometryConditionBuilder extends GeometryConditionBuilder {        
    public MySqlGeometryConditionBuilder(GeometryConverter polygonConverter, Database database) {
        super(polygonConverter, database);
    }

    @Override
    protected String getValueCondition(Filter filter, String paramName, String sourceName) {
        return database.getSqlOperator(filter.getComparisonType()) + "(" + filter.getSqlColumn() + ",:" + paramName + ")";    
    }
}

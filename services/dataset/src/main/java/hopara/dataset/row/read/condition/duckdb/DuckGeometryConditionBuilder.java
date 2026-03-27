package hopara.dataset.row.read.condition.duckdb;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.row.converter.GeometryConverter;
import hopara.dataset.row.read.condition.GeometryConditionBuilder;

public class DuckGeometryConditionBuilder extends GeometryConditionBuilder {
    public DuckGeometryConditionBuilder(GeometryConverter polygonConverter, Database database) {
        super(polygonConverter, database);
    }

    @Override
    protected String getValueCondition(Filter filter, String paramName, String tableName) {
        return "1=1";
    }
}

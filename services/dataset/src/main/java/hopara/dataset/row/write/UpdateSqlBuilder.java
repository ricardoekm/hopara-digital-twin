package hopara.dataset.row.write;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.table.Table;

@Component
public class UpdateSqlBuilder extends WriteSqlBuilder {
    @Autowired
    QueryFilterService filterService;

    @Autowired
    Database database;

    protected String getWhereClause(Table table, Filters filters) {
        return "WHERE 1 = 1" + filterService.getWhereClause(table.getFilterColumns(), filters,  table.getSqlName());
    }

    private String getSetClause(Columns columns, Map<String, Object> params) {
        var updates = new ArrayList<String>();
        for (String key : params.keySet()) {
            if ( Filter.isFilterParam(key) || !columns.contains(key) ) {
                continue;
            }
              
            if ( columns.get(key).isType(ColumnType.GEOMETRY) ) {
                updates.add(key + "=" + getGeometryPlaceholder(key));
            }
            else if ( columns.get(key).isType(ColumnType.JSON) ) {
				updates.add(getJsonPlaceholder(key));
			}
            else {
                updates.add(key + "=:" + key);
            }
        }

        if ( updates.isEmpty() ) {
            throw new IllegalArgumentException("No column found to update!");
        }

        return "SET " + String.join(",", updates);
    }

    public String getQuery(Table table, Map<String, Object> params, Filters filters) {
        return "UPDATE " + table.getSqlName() + " " + getSetClause(table.getColumns(),params) + " " + getWhereClause(table, filters);
    }
}

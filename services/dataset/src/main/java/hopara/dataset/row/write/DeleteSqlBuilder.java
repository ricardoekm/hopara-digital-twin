package hopara.dataset.row.write;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.table.Table;

@Component
public class DeleteSqlBuilder extends WriteSqlBuilder {
    @Autowired
    QueryFilterService filterService;

    protected String getWhereClause(Table table, Filters filters) {
        var whereClause = filterService.getWhereClause(table.getFilterColumns(), filters, table.getSqlName());
        if ( StringUtils.isBlank(whereClause) ) {
            throw new IllegalArgumentException("Empty or invalid filters are not allowed");
        }
        return " WHERE 1 = 1" + whereClause;
    }

    private String getBaseQuery(Table table) {
        return "DELETE FROM " + table.getSqlName();
    }

    public String getQuery(Table table, Filters filters) {
        return getBaseQuery(table) + getWhereClause(table, filters);
    }

    public String getDeleteAllQuery(Table table) {
        return getBaseQuery(table);
    }
}

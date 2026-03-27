package hopara.dataset.row.read;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.converter.ConverterExecutor;
import hopara.dataset.table.Table;

// Used only for tests, remove in the future
@Component
public class RowReadTableRepository extends RowReadRepository {
    @Autowired
    TableSqlBuilder tableSqlBuilder;
    
    private Object processRow(Map<String, Object> row, ConverterExecutor converterExecutor) {
        return converterExecutor.fromDatabaseFormat(row);
    }
    
    @SuppressWarnings("unchecked")
    public List<Map<String,Object>> find(Table table, Filters filters, Integer limit, Sort sort) { 
        var params = filterService.getParams(table.getFilterColumns(), filters);             
        var query = tableSqlBuilder.getQuery(table, filters, limit, sort);
        logQuery(params, query);
        
        var rows = namedJdbcTemplate.queryForList(query, params);
                    
        var converterExecutor = converterExecutorFactory.create(table.getFilterColumns());        
        List<Object> processedRows = rows.stream()
                                         .map(row -> processRow(row, converterExecutor))
                                         .collect(Collectors.toList());
        return (List<Map<String,Object>>)(Object)processedRows;
    }
    

    public List<Map<String,Object>> find(Table table, Filters filters) {    
        return find(table, filters, defaultFetchLimit, null);
    }
}

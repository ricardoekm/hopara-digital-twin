package hopara.dataset.row.write;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.column.Column;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.Row;
import hopara.dataset.row.Rows;
import hopara.dataset.row.WriteResult;
import hopara.dataset.row.converter.ConverterExecutorFactory;
import hopara.dataset.table.Table;

@Component
@Transactional("dataTx")
public class RowWriteRepository {

    private Log log = LogFactory.getLog(RowWriteRepository.class);

    @Autowired
    private InsertSqlBuilder insertSqlBuilder;

    @Autowired
    private UpdateSqlBuilder updateSqlBuilder;

    @Autowired
    private DeleteSqlBuilder deleteSqlBuilder;

    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate namedJdbcTemplate;

    @Autowired
    private QueryFilterService filterService;

    @Autowired
    private ConverterExecutorFactory converterExecutorFactory;

    private Map<String, Object> getInsertParams(Table table, Row row) {
        var params = new HashMap<String, Object>();

        for (var column : table.getColumns()) {
            params.put(column.getName(), row.getValue(column.getName()));
        }

        return params;
    }

    private Boolean isValid(Table table, Map<String,Object> values, WriteResult writeResult) {
        for (var value : values.entrySet()) {
            var column = table.getColumns().get(value.getKey());
            if (column == null) {
                log.debug("Column " + value.getKey() + " not found in " + table.getName());
                continue;
            }

            if (value.getValue() instanceof List && !column.isListValueValid()) {
                writeResult.setErrorMessage("Array value: " + value.getKey() + " is not compatible with column type: " + column.getType());
                return false;
            }
        }

        return true;
    }

    @SuppressWarnings("unchecked")
    private Map<String,Object>[] getInsertParams(Table table, List<Row> rows, WriteResult result) {
        var converter = converterExecutorFactory.create(table.getColumns());
        var insertParams = rows.stream().filter(row -> isValid(table, row.getValues(), result))
                                        .map(row -> converter.toDatabaseFormat(row)).map(row -> getInsertParams(table, row))
                                        .toArray(Map[]::new);
        return insertParams;
    }

    public WriteResult insert(Table table, List<Row> rows) {
        try {
            var result = new WriteResult(rows.size());

            var query = insertSqlBuilder.getQuery(table, rows);
            log.debug(query);
    
            var insertParams = getInsertParams(table, rows, result);
            var affectedRows = namedJdbcTemplate.batchUpdate(query, insertParams);
            result.setSuccessCount(Arrays.stream(affectedRows).sum());
            
            if ( result.getFailureCount() > 0 ) {
                log.debug("Error inserting rows, example cause: " + result.getErrorMessage());
            }
    
            return result;
        } catch(DataAccessException e) {
            throw new InsertSQLException(table,e);
        }
    }

    private Map<String, Object> getDeleteParams(Table table, Filters filters) {
        var params = new HashMap<String, Object>();
        params.putAll(filterService.getParams(table.getFilterColumns(), filters));
        return params;
    }

    public WriteResult delete(Table table, Filters filters) {
        var query = deleteSqlBuilder.getQuery(table, filters);
        log.debug(query);
        
        var params = getDeleteParams(table,filters);
        var successCount = namedJdbcTemplate.update(query, params);
        
        var result = new WriteResult(successCount);
        result.setSuccessCount(successCount);
        return result;
    }

     public WriteResult deleteAll(Table table) {
        var query = deleteSqlBuilder.getDeleteAllQuery(table);
        log.debug(query);

        var successCount = namedJdbcTemplate.update(query, new HashMap<String, Object>());
        var result = new WriteResult(successCount);
        result.setSuccessCount(successCount);
        return result;
     }

    public List<Object> insert(Table table, Rows rows, Column selectColumn) {
        var result = new WriteResult(1);

        var query = insertSqlBuilder.getQuery(table, rows, selectColumn);
        log.debug(query);
        var insertParams = getInsertParams(table, rows, result);

        var selectValues = new ArrayList<Object>();
        for ( var insertParam : insertParams ) {
            var selectValue = namedJdbcTemplate.queryForObject(query, insertParam, Object.class);
            selectValues.add(selectValue);
        }

        return selectValues;
    }

    private Map<String, Object> doGetUpdateParams(Table table, Row row, Filters filters) {
        var params = new HashMap<String, Object>();
        params.putAll(row.getValues());
        params.putAll(filterService.getParams(table.getFilterColumns(), filters));

        return params;
    }

    private Map<String, Object> getUpdateParams(Table table, Row updateValues, Filters filters) {
        var converter = converterExecutorFactory.create(table.getColumns());
        var updateParams = doGetUpdateParams(table, converter.toDatabaseFormat(updateValues), filters);
        return updateParams;
    }

    public WriteResult update(Table table, Row row, Filters filters) {
        var result = new WriteResult(1);

        if ( !isValid(table, row.getValues(), result) ) {
            return result;
        }
               
        var updateParams = getUpdateParams(table, row, filters);
        var query = updateSqlBuilder.getQuery(table, updateParams, filters);
        var successCount = namedJdbcTemplate.update(query, updateParams);
        result.setSuccessCount(successCount);

        return result;
    }
}

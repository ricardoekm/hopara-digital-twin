package hopara.dataset.position;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Columns;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.read.RowReadTableRepository;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableService;

@Component
public class PositionHistoryRepository {
    
    @Autowired
    RowReadTableRepository rowReadTableRepository;

    @Autowired
    TableService tableService;

    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate namedJdbcTemplate;

    @Autowired
    @Qualifier("dataJdbcTemplate")
    private JdbcTemplate dataJdbcTemplate;

    @Autowired
    QueryFilterService filterService;

    private void createWriteHistoryFunction() {
        var sql = """
         DO $$
         BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_proc
                        WHERE proname = 'write_pos_history'
                        AND pg_function_is_visible(oid)) THEN
               CREATE FUNCTION write_pos_history()
               RETURNS TRIGGER AS $function$
               BEGIN
                  EXECUTE format('INSERT INTO %I(id, point_2d, point_3d, line, rectangle, polygon, floor, hopara_scope, tenantId, created_at)
                  VALUES (%L,  %L, %L, %L, %L, %L, %L, %L, %L, clock_timestamp() at time zone ''utc'')',
                  TG_TABLE_NAME || '_hist', NEW.id, NEW.point_2d, NEW.point_3d, NEW.line, NEW.rectangle, NEW.polygon, NEW.floor, NEW.hopara_scope, NEW.tenantId);
                  RETURN NEW;
               EXCEPTION WHEN OTHERS THEN NULL;
               RETURN NULL;
               END;
               $function$ LANGUAGE plpgsql;
            END IF;
         END $$;
        """;
        dataJdbcTemplate.execute(sql);
    }

    private void createWriteHistoryTrigger(Table positionTable) {
        var sql = """
            CREATE OR REPLACE TRIGGER trigger_$table_hist
            AFTER INSERT OR UPDATE ON $table
            FOR EACH ROW
            EXECUTE FUNCTION write_pos_history();
        """.replaceAll("\\$table", positionTable.getSqlName());
        dataJdbcTemplate.execute(sql);
    }

    public void createHistoryTable(Table positionTable) {
        var historyTable = new PositionHistoryTable(positionTable);
        if ( !tableService.has(historyTable.getKey()) ) {
            tableService.save(historyTable);
            createWriteHistoryFunction();
            createWriteHistoryTrigger(positionTable);
        }
    }

    private String getRollbackRowsQuery(PositionHistoryTable historyTable, Object date, Filters filters) {
        var dateFilter = new Filter(PositionHistoryColumns.CREATED_AT_COLUMN_NAME, date, Operator.LESS_EQUALS_THAN);
        var filtersWithoutDate = filters.clone();
        filtersWithoutDate.delete(PositionHistoryColumns.CREATED_AT_COLUMN_NAME);

        var rollbackRowsQuery = """
            SELECT * FROM (
                SELECT id,
                       point_2d,
                       point_3d,
                       line,
                       rectangle,
                       polygon,
                       floor,
                       ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at desc) index
                FROM $table WHERE 1 = 1 $whereClause
                UNION ALL 
                SELECT id,
                       null as point_2d,
                       null as point_3d,
                       null as line,
                       null as rectangle,
                       null as polygon,
                       null as floor,
                       1 as index
                    FROM $table
                    WHERE 1 = 1 $whereClauseWithoutDate
                    GROUP BY id
                    HAVING min(created_at) > :$dateParamName
            ) AS rollback_rows
        """.replaceAll("\\$table", historyTable.getSqlName())
           .replaceAll("\\$whereClauseWithoutDate", filterService.getWhereClause(historyTable.getColumns(), filtersWithoutDate, historyTable.getSqlName()))
            .replaceAll("\\$whereClause", filterService.getWhereClause(historyTable.getColumns(), filters, historyTable.getSqlName()))
           .replaceAll("\\$dateParamName", dateFilter.getParamName(0));
        return rollbackRowsQuery + " WHERE index = 1"; 
    }

    private String getRollbackUpdateQueryWhere(Table positionTable, Filters filters) {
        var rollbackUpdateQuery = """
            UPDATE $table pos
            SET floor = hist.floor,
                point_2d = hist.point_2d,
                point_3d = hist.point_3d,
                line = hist.line,
                rectangle = hist.rectangle,
                polygon = hist.polygon
            FROM hist
        """.replaceAll("\\$table", positionTable.getSqlName());

        return rollbackUpdateQuery + " WHERE pos.id = hist.id" + filterService.getWhereClause(positionTable.getColumns(), filters, positionTable.getSqlName());
    }

    private String getRollbackQuery(Table positionTable, PositionHistoryTable historyTable, Object date, Filters filters) {
        var rollbackRowsQuery = getRollbackRowsQuery(historyTable, date, filters);
        var rollbackUpdateQuery = getRollbackUpdateQueryWhere(positionTable, filters);
        return "WITH hist AS " +
               "(" + rollbackRowsQuery + ")" + rollbackUpdateQuery;
    }

    public List<String> rollback(Table positionTable, Object date, Filters filters) {
        filters.add(new Filter(PositionHistoryColumns.CREATED_AT_COLUMN_NAME, date, Operator.LESS_EQUALS_THAN));

        var historyTable = new PositionHistoryTable(positionTable);
        var rollbackQuery = getRollbackQuery(positionTable, historyTable, date, filters);

        var allColumns = new Columns();
        allColumns.addAll(positionTable.getColumns());
        allColumns.addAll(historyTable.getColumns());
        var params = filterService.getParams(allColumns, filters);

        // Uncomment for debugging purposes, you're welcome
        // var historyRows =  namedJdbcTemplate.queryForList("SELECT * FROM " + historyTable.getSqlName(), params);
        var rollbackRowsQuery = getRollbackRowsQuery(historyTable, date, filters);
        var rollbackRows = namedJdbcTemplate.queryForList(rollbackRowsQuery, params);
        namedJdbcTemplate.update(rollbackQuery, params);

        return rollbackRows.stream().map(row -> row.get("id").toString()).toList();
    }
}

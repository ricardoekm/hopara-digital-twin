package hopara.dataset.stats.column;

import java.util.HashSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.row.read.ViewSqlBuilder;
import hopara.dataset.stats.QuantitativeStatsRowMapper;
import hopara.dataset.stats.StatsGenerator;
import hopara.dataset.stats.StringStatsRowMapper;
import hopara.dataset.view.View;

@Component
public class ColumnStatsGenerator extends StatsGenerator {
    private Log log = LogFactory.getLog(ColumnStatsRepository.class);

    @Autowired
    @Qualifier("longRunningDataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate dataNamedJdbcTemplate;
    
    @Autowired
    protected ViewSqlBuilder viewSqlBuilder;
    
    @Autowired
    Database database;
       
    private String getQuantitativeStatsQuery(View view) {
        // To fix conflict with table with same name
        view = view.cloneWithUniqueName();
        
        var statsQuery = getQuery(view.getQueryName(),view.getColumns());    
        return viewSqlBuilder.getCteQuery(view, statsQuery,null);
    }

    public Boolean hasStringStats(View view) {
        return view.getColumns().filterType(ColumnType.STRING).size() > 0 && database.supportArray();
    }

    private String getStringStatsQuery(View view) {
        // To fix conflict with table with same name
        view = view.cloneWithUniqueName();        

        var query = "";
        var stringColumns = view.getColumns().filterType(ColumnType.STRING); 
        for ( var column : stringColumns ) {
            if ( !query.isEmpty() ) {
                query += "\nUNION ALL\n";
            }

            query += getStringQuery(view.getQueryName(), column);
        }

        return viewSqlBuilder.getCteQuery(view, query,null);
    }

    private void addBooleanStats(Columns columns, ColumnStatsList columnStatsList) {
        var booleanColumns = columns.filterType(ColumnType.BOOLEAN);
        var values = new HashSet<String>();
        values.add("false");
        values.add("true");

        for ( var column : booleanColumns ) {
            var columnsStats = new ColumnStats(column.getName());
            columnsStats.setValues(values);
            columnStatsList.add(columnsStats);
        }
    }
    
    public ColumnStatsList generateStats(View view) {
        var columnStatsList = new ColumnStatsList();
        
        try {
            if ( hasQuantitativeStats(view.getColumns()) ) {
                var quantitativeRowMapper = new QuantitativeStatsRowMapper(database, view.getColumns());
                var result = dataNamedJdbcTemplate.query(getQuantitativeStatsQuery(view), quantitativeRowMapper);                
                if ( result.size() > 0 ) {
                    columnStatsList.addAll(result.get(0));
                }
            }

            if ( hasStringStats(view) ) {
                var stringStatsRowMapper = new StringStatsRowMapper(database);
                var result = dataNamedJdbcTemplate.query(getStringStatsQuery(view), stringStatsRowMapper);                
                columnStatsList.addAll(result);
            }

            addBooleanStats(view.getColumns(), columnStatsList);
        } catch(Exception e) {
            log.error("Couldnt generate stats for " + view,e);
        }
        
        return columnStatsList;
    }
}

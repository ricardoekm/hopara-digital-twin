package hopara.dataset.stats.column;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.column.TypeHint;
import hopara.dataset.database.Database;
import hopara.dataset.position.PositionView;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.view.View;

@Component
public class ColumnStatsRepository {
    
    @Autowired
    private ColumnStatsGenerator columnStatsGenerator;
    
    @Autowired
    protected ColumnStatsRowMapper rowMapper;

    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate dataNamedJdbcTemplate;
        
    @Autowired
    private NamedParameterJdbcTemplate namedJdbcTemplate;
    
    @Autowired
    Database database;
    
    @Autowired
    @Qualifier("numberArrayConverter")
    ArrayConverter numberArrayConverter;
    
    @Autowired
    @Qualifier("arrayConverter")
    ArrayConverter stringArrayConverter;
    
    public String getStatsFields() {
        return "min_x as column_min_x, max_x as column_max_x, min_y as column_min_y," +
               "max_y as column_max_y, percentiles as column_percentiles, min_y is null as column_one_dimension, top_values as column_top_values";
    }

    private String getBaseQuery() {
        return "SELECT name as column_name, "+ getStatsFields() + " FROM hp_columns ";
    }

    private String getFindQuery(View view) {
        return getBaseQuery() + "WHERE view_id = :view_id";    
    }
    
    private Map<String, Object> getFindParams(View view) {
        var params = new HashMap<String, Object>();
        params.put("view_id", view.getId());
        return params;
    }
    
    public ColumnStatsList find(View view) {
        var columnStatsList = new ColumnStatsList();
        var list = namedJdbcTemplate.query(getFindQuery(view), getFindParams(view), rowMapper);
        columnStatsList.addAll(list);
        return columnStatsList;
    }

    // We only need to update because the column entry has already been created
    private String getUpdateStatsQuery() {
        var query =  "UPDATE hp_columns "
                   + "SET min_x = :min_x, max_x = :max_x, min_y = :min_y, max_y = :max_y, percentiles = :percentiles, top_values = :top_values "
                   + "WHERE name = :name "
                   + " AND view_id = :view_id";
        
        return query;
    }
    
    private Map<String, Object> getSingleUpdateStatsParams(View view, ColumnStats stats) {
        var column = view.getColumns().get(stats.getName());

        var params = new HashMap<String, Object>();
        params.put("view_id", view.getId());
        params.put("name", column.getOriginalName());
        params.put("min_x", stats.getMin());
        params.put("max_x", stats.getMax());
        params.put("min_y", stats.getMinY());
        params.put("max_y", stats.getMaxY());
        params.put("percentiles", numberArrayConverter.toDatabaseFormat(stats.getPercentiles(), TypeHint.NONE));
        params.put("top_values", stringArrayConverter.toDatabaseFormat(stats.getValues(), TypeHint.NONE));

        return params;
    }
    
    @SuppressWarnings("unchecked")
    private Map<String, Object>[] getUpdateStatsParams(View view) {
        var columnsStats = columnStatsGenerator.generateStats(view);
        return columnsStats.stream()
                           .map(singleColumnStats -> getSingleUpdateStatsParams(view, singleColumnStats))
                           .toArray(Map[]::new);
    }

    public void refreshStats(View view) {  
        if ( PositionView.isPositionView(view.getKey()) ) {
            // No need to generate stats for position views
            return;
        }
        
        if ( view.getColumns().size() == 0 ) {
            throw new IllegalArgumentException("No stats to update in " + view);
        }

        var updateStatsParams = getUpdateStatsParams(view);
        if ( updateStatsParams.length > 0 ) {
            namedJdbcTemplate.batchUpdate(getUpdateStatsQuery(), updateStatsParams);
        }
    }

    public void setPercentilStep(BigDecimal percentilStep) {
        columnStatsGenerator.setPercentilStep(percentilStep);
    }
}

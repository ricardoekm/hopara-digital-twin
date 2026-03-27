package hopara.dataset.column;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;
import hopara.dataset.stats.column.ColumnStatsRepository;
import hopara.dataset.view.View;

@Component
public class ColumnRepository {
    
	@Autowired
	ColumnStatsRepository statsRepository;

    @Autowired
    SimpleJdbcInsert simpleJdbcInsert;    
    
    @Autowired
    JdbcTemplate jdbcTemplate;
        
    @PostConstruct
    public void configInsert() {
        simpleJdbcInsert.withTableName("hp_columns")
                        .withoutTableColumnMetaDataAccess()
                        .usingColumns(new String[]{"name","type","view_id"});        
    }   
    
    private Map<String,Object> getInsertParams(Column column, String parentId) {
		var params = new HashMap<String,Object>();
		params.put("name", column.getOriginalName());
		params.put("type", column.getType().toString());
		params.put("view_id", parentId);
		return params;
	}
	
	@SuppressWarnings("unchecked")
	public void save(Columns columns, String parentId) {	
		
        Map<String,Object>[] insertParams = columns
											.stream()
											.map(column -> getInsertParams(column, parentId))
											.toArray(Map[]::new);
        			
		int[] affectedRows = simpleJdbcInsert.executeBatch(insertParams);
		if (  Arrays.stream(affectedRows).sum() != columns.size() ) {
			throw new RuntimeException("Unable to insert columns");
		}				
	}
    
    public void delete(View view) {
        String sql = "DELETE from hp_columns WHERE view_id = ?";
        jdbcTemplate.update(sql, view.getId());
    }
    
    // Used for tests only
    public void deleteAll(String startsWith) {
        String sql = "DELETE from hp_columns WHERE view_id like ?";
        jdbcTemplate.update(sql, startsWith + "%");
    }
}

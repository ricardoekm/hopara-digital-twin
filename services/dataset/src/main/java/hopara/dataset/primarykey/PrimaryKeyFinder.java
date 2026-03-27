package hopara.dataset.primarykey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Column;
import hopara.dataset.view.View;

@Component
public class PrimaryKeyFinder {

    @Autowired
  	@Qualifier("dataJdbcTemplate")
    JdbcTemplate dataJdbcTemplate;

    @Autowired
    PrimaryKeyQueryGenerator primaryKeyQueryGenerator;

    public Column find(View view) {
        var query = primaryKeyQueryGenerator.getQuery(view);
        var resultMap = dataJdbcTemplate.queryForMap(query);

        var total = resultMap.get(PrimaryKeyQueryGenerator.TOTAL_COLUMN_NAME);
        for ( var result : resultMap.entrySet() ) {
            if ( result.getKey().equals(PrimaryKeyQueryGenerator.TOTAL_COLUMN_NAME) ) {
                continue;
            }

            if ( total.equals(result.getValue()) ) {
                return view.getColumns().get(result.getKey());
            }
        }

        return null;
    }   
}

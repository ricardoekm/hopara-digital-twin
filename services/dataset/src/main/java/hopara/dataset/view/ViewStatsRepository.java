package hopara.dataset.view;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.row.read.ViewSqlBuilder;

@Component
public class ViewStatsRepository {

    @Autowired
    ViewSqlBuilder viewSqlBuilder;

    @Autowired
    @Qualifier("dataJdbcTemplate")
    JdbcTemplate dataJdbcTemplate;

    @Autowired
    JdbcTemplate metadataJdbcTemplate;

    public void refreshStats(View view) {              
        var query = viewSqlBuilder.getCteQuery(view, "SELECT COUNT(*) FROM " + view.getQueryName(), 1);
        var rowCount = dataJdbcTemplate.queryForObject(query, Integer.class);       
        view.setRowCount(rowCount);

        metadataJdbcTemplate.update("UPDATE hp_views SET row_count = ? WHERE id = ?", rowCount, view.getId());
    }
}

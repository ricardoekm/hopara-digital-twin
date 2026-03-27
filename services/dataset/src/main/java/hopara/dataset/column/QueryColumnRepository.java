package hopara.dataset.column;

import hopara.dataset.sqlquery.SqlQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class QueryColumnRepository {
    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate dataNamedJdbcTemplate;

    @Autowired
    ColumnFromMetadataExtractor columnFromMetadataExtractor;

    public Columns getFromQuery(SqlQuery query) {
        query.setLimit(1);
        return dataNamedJdbcTemplate.query(query.toString(), columnFromMetadataExtractor);
    }    
}

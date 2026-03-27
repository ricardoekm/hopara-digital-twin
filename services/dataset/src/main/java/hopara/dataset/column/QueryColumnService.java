package hopara.dataset.column;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.datafile.DataFileService;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.sqlquery.SqlQuery;

@Component
public class QueryColumnService {
    
    @Autowired
    QueryColumnRepository queryColumnRepository;

    @Autowired
    DataFileService dataFileService;

    @Autowired
    DataSourceRepository dataSourceRepository;

    public Columns getFromQueryExecution(SqlQuery query) {
		  dataFileService.loadTables(query);
		  return queryColumnRepository.getFromQuery(query);
	}
}

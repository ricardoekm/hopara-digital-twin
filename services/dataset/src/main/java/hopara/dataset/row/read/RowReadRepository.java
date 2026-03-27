package hopara.dataset.row.read;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.converter.ConverterExecutorFactory;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.web.debug.Debugger;

@Component
public abstract class RowReadRepository {
    private Log logger = LogFactory.getLog(RowReadRepository.class);

	@Autowired
	@Qualifier("dataNamedJdbcTemplate")
	protected NamedParameterJdbcTemplate namedJdbcTemplate;
	
	@Autowired
    @Qualifier("defaultFetchLimit")
	Integer defaultFetchLimit;
    
	@Autowired
	protected QueryFilterService filterService;
	
	@Autowired
	protected ConverterExecutorFactory converterExecutorFactory;

	@Autowired
    protected Database database;
	
	private String getValueAsString(Object value) {
	    if ( value instanceof String ) {
	        return "'" + value.toString() + "'";
	    }
	    else {
	        return value.toString();
	    }
	}
	
    protected String getQueryWithParams(String query,Map<String, Object> params) {
        var queryWithParams = query;
        for (var param : params.entrySet()) {
            if ( param.getValue() instanceof String || param.getValue() instanceof Number ) {
                queryWithParams = queryWithParams.replaceAll(":" + param.getKey(), getValueAsString(param.getValue()));
            }
        }
        return queryWithParams;
    }

	public void doLogQuery(Map<String, Object> params, String query) {
		var sqlQuery = new SqlQuery(getQueryWithParams(query, params), database.getDbClass());

		if ( logger.isDebugEnabled() ) {
			logger.debug(sqlQuery.toPrettyString());
			logger.debug(params);	
		}

		if ( Debugger.isDebugging() ) {
			Debugger.setQuery(sqlQuery.toString());
			Debugger.setParams(params);
		}
	}
	
	protected void logQuery(Map<String, Object> params, String query) {
		if ( logger.isDebugEnabled() || Debugger.isDebugging() ) {		    		    
			doLogQuery(params, query);
		}
	}
}

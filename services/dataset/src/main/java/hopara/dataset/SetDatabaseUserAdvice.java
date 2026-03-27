package hopara.dataset;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.web.TenantService;

@Aspect
@Component
public class SetDatabaseUserAdvice {
    @Autowired
    TenantService tenantService;
    
    @Autowired
    JdbcTemplate jdbcTemplate;
    
    @Pointcut("execution(* hopara.dataset.row.RowService.*(..))")
    private void rowService() {
    }

    @Pointcut("execution(* hopara.dataset.view.ViewService.*(..))")
    private void viewService() {
    }

    @Pointcut("execution(* hopara.dataset.table.TableService.*(..))")
    private void tableService() {
    }

    @Pointcut("execution(* hopara.dataset.datasource.DataSourceService.*(..))")
    private void dataSourceService() {
    }

    @Pointcut("execution(* hopara.dataset.script.ScriptService.*(..))")
    private void scriptService() {
    }    

    @Pointcut("execution(* hopara.dataset.column.ColumnService.*(..))")
    private void columnService() {
    }

    @Pointcut("execution(* hopara.dataset.search.SearchService.*(..))")
    private void searchService() {
    }

    @Pointcut("execution(* hopara.dataset.entitytable.EntityService.*(..))")
    private void entityService() {
    }

    private void setSessionAuthorization(Object tenant, JdbcTemplate jdbcTemplate) {        
        // We need to add public to search path because of postgis functions
        // https://gis.stackexchange.com/questions/43187/using-schema-other-than-public-in-postgis
        jdbcTemplate.execute("SET search_path TO " + tenant + ", public;");
    }

    // We don't need to set on the data jdbc template because the connection will set the user and search path directly
    @Before("columnService() || tableService() || viewService() ||  rowService() || dataSourceService() || scriptService() || searchService() || entityService()")
    public void setDatabaseUser(JoinPoint joinPoint) {  
        setSessionAuthorization(tenantService.getTenant(), jdbcTemplate);
    }
}

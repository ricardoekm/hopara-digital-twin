package hopara.dataset.datasource;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;

@Aspect
@Component
public class SetCurrentDataSourceAdvice {
    @Autowired
    DataSourceRepository dataSourceRepository;

    @Pointcut("execution(* hopara.dataset.table.TableService.*(..))")
    private void tableService() {
    }

    @Pointcut("execution(* hopara.dataset.row.write.RowWriteRepository.*(..))")
    private void writeRepository() {
    }

    @Pointcut("execution(* hopara.dataset.view.ViewService.upsert(..))")
    private void viewService() {
    }

    @Before("tableService() || writeRepository() || viewService()")
    public void setCurrentDatasouce(JoinPoint joinPoint) {  
        for ( var arg : joinPoint.getArgs() ) {
            if ( arg instanceof Table ) {
                var table = (Table)arg;
                dataSourceRepository.setCurrentName(table.getDataSourceName());
                break;
            }
            else if ( arg instanceof View ) {
                var view = (View)arg;
                dataSourceRepository.setCurrentName(view.getDataSourceName());
                break;
            }
        }
    }
}

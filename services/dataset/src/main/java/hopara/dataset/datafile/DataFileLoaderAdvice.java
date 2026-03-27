package hopara.dataset.datafile;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import hopara.dataset.view.View;

@Aspect
@Component
public class DataFileLoaderAdvice {
    @Autowired
    DataFileService dataFileService;
    
    @Pointcut("execution(* hopara.dataset.row.read.RowReadViewRepository.find*(..))")
    private void findRows() {
    }

    @Before("findRows()")
    public void setDatabaseUser(JoinPoint joinPoint) {  
        for ( var arg : joinPoint.getArgs() ) {
            if ( arg instanceof View ) {
                var view = (View)arg;
                dataFileService.loadTables(view.getSqlQuery());
            } 
        }
    }
}

package hopara.dataset.row;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewService;

@Aspect
@Component
public class TableChangedAdvice {
    private Log logger = LogFactory.getLog(TableChangedAdvice.class);

    @Autowired
    ViewService viewService;

    @Pointcut("execution(* hopara.dataset.row.RowService.*(..))")
    private void rowService() {
    }

    public static String COLUMN_NOT_FOUND_ERROR_CODE = "42703";

    private Boolean tryRecovery(Object[] args, Exception e) {
        if ( e.getCause() != null && e.getCause() instanceof PSQLException) {
            var psqlException = (PSQLException)e.getCause();
            if ( psqlException.getSQLState().equals(COLUMN_NOT_FOUND_ERROR_CODE) ) {
                logger.warn("Column not found on view, trying recovery");
                for ( var arg : args ) {
                    if ( arg instanceof ViewKey ) {
                        var viewKey = (ViewKey)arg;
                        viewService.refresh(viewKey);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    @Around("rowService()")
    public Object setCurrentDatasouce(ProceedingJoinPoint joinPoint) throws Throwable {  
        try {
            return joinPoint.proceed();
        } catch(Exception e) {
            var recovered = tryRecovery(joinPoint.getArgs(), e);
            if ( recovered ) {
                return joinPoint.proceed();
            }

            throw e;
        }
    }
}

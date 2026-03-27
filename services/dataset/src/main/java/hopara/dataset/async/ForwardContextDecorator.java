package hopara.dataset.async;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskDecorator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.web.SessionService;
import hopara.dataset.web.TenantService;

@Component
public class ForwardContextDecorator implements TaskDecorator {
    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    SessionService sessionService;

    @Autowired
    TenantService tenantService;

    public Runnable decorate(Runnable runnable) {
        var currentDataSourceName = dataSourceRepository.getCurrentName();
        var currentTenantName = tenantService.getRawTenant();
        var currentSessionId = sessionService.getCurrentSessionId();
        var securityContext = SecurityContextHolder.getContext();

        return () -> {
            try {
                dataSourceRepository.setCurrentName(currentDataSourceName);
                tenantService.setCurrentTenant(currentTenantName);
                sessionService.setCurrentSessionId(currentSessionId);
                SecurityContextHolder.setContext(securityContext);
                runnable.run();
            } finally {
                SecurityContextHolder.clearContext();   
                dataSourceRepository.setCurrentName(null);
                tenantService.setCurrentTenant(null);
            }
        };
    }
}

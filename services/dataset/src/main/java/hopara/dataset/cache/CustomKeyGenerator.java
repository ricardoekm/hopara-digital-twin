package hopara.dataset.cache;

import java.lang.reflect.Method;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.interceptor.KeyGenerator;
import hopara.dataset.web.TenantService;

public class CustomKeyGenerator implements KeyGenerator {
    
    @Autowired
    TenantService tenantService;
    
    @Override
    public Object generate(Object target, Method method, Object... params) {
        String customKey = "";
        if ( target instanceof CustomCacheKeyProvider ) {
            customKey = ((CustomCacheKeyProvider)target).getKey();
        }

        var paramsHash = "";
        for ( var param : params ) {
            if ( param != null ) {
                paramsHash += param.hashCode();
            }
        }

        return  tenantService.getTenant() + "_"
                + target.getClass().getSimpleName() + "_"
                + method.getName() + "_"
                + paramsHash
                + customKey;
    }
}
package hopara.dataset.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

import hopara.dataset.web.TenantService;

public class MultiTenantCacheManager extends ConcurrentMapCacheManager {
    @Autowired
    TenantService tenantService;

    @Override
    protected Cache createConcurrentMapCache(String name) {
      return new MultiTenantCache(name, this.isAllowNullValues(), tenantService);
    }

    public void clear(String name) {
        var cache = (MultiTenantCache)getCache(name);
        cache.clearAll();
    }
}

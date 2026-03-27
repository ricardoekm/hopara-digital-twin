package hopara.dataset.cache;

import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.concurrent.ConcurrentMapCache;

import hopara.dataset.web.TenantService;

public class MultiTenantCache implements Cache {
    Boolean allowNullValues;
    String name;
    TenantService tenantService;
    Map<String,Cache> caches;

    private Log logger = LogFactory.getLog(MultiTenantCache.class);


    protected MultiTenantCache(String name, boolean allowNullValues, TenantService tenantService) {
        this.name = name;
        this.allowNullValues = allowNullValues;
        this.tenantService = tenantService;
        this.caches = new ConcurrentHashMap<String,Cache>();
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private Cache getCache() {
        try {
            var tenant = tenantService.getTenant();
            if ( !caches.containsKey(tenant) ) {
                var cache = new ConcurrentMapCache(name, new ConcurrentHashMap(256), allowNullValues);
                caches.put(tenant, cache);
            }
    
            return caches.get(tenant);
        }
        catch(Exception e) {
            logger.error("Could not get tenant cache", e);
            return new ConcurrentMapCache("dummy", new ConcurrentHashMap(256), allowNullValues);
        }
        
    }

    public void clearAll() {
        for ( var cache : this.caches.values() ) {
            cache.clear();
        }
    }

    public boolean invalidateAll() {
        var result = true;
        for ( var cache : this.caches.values() ) {
            result = cache.invalidate();
        }
        return result;
    }

    @Override
    public void clear() {
        getCache().clear();
    }

    @Override
    public boolean invalidate() {
        return getCache().invalidate();
    }

    @Override
    public void evict(Object key) {
        getCache().evict(key);
    }

    @Override
    public ValueWrapper get(Object arg0) {
        return getCache().get(arg0);
    }

    @Override
    public <T> T get(Object arg0, Class<T> arg1) {
        return getCache().get(arg0, arg1);
    }

    @Override
    public <T> T get(Object arg0, Callable<T> arg1) {
        return getCache().get(arg0, arg1);
    }

    @Override
    public String getName() {
        return getCache().getName();
    }

    @Override
    public Object getNativeCache() {
        return getCache().getNativeCache();
    }

    @Override
    public void put(Object arg0, Object arg1) {
        getCache().put(arg0, arg1);
    }
}

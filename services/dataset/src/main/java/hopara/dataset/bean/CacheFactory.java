package hopara.dataset.bean;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import hopara.dataset.cache.MultiTenantCacheManager;
import hopara.dataset.cache.CacheService;
import hopara.dataset.cache.CustomKeyGenerator;

@Configuration
public class CacheFactory implements CachingConfigurer {
    @Bean
    public KeyGenerator tenantKeyGenerator() {
        return new CustomKeyGenerator(); 
    }

    @Bean 
    public MultiTenantCacheManager tenantCacheManager() {
        return new MultiTenantCacheManager();
    }

    @Bean
    public CacheService cacheService() {
        return new CacheService();
    }
    
    @Override
    public KeyGenerator keyGenerator() {
        return tenantKeyGenerator();
    }

    @Override
    public CacheManager cacheManager() {
        return tenantCacheManager();
    }
}

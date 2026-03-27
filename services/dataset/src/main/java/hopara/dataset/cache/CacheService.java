package hopara.dataset.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import hopara.dataset.datafile.DataFileTableRepository;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.row.read.ViewSqlBuilder;
import hopara.dataset.table.TableRepository;
import hopara.dataset.view.ViewRepository;

public class CacheService {
    @Autowired
    MultiTenantCacheManager cacheManager;
    
    @Scheduled(fixedRate = 60*1000*10)
    public void clear() {
        cacheManager.clear(TableRepository.CACHE_NAME);
        cacheManager.clear(ViewRepository.CACHE_NAME);
        cacheManager.clear(ViewSqlBuilder.CACHE_NAME);
    }

    @Scheduled(fixedRate = 60*1000*30)
    public void clear2() {
        cacheManager.clear(DataSourceRepository.CACHE_NAME);
        cacheManager.clear(DataFileTableRepository.CACHE_NAME);
    }
}

package hopara.dataset.datafile;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.view.ViewService;

// Separate class for the proxy async to work
@Component
public class DataFileServiceHelper {
    @Autowired
    ViewService viewService;

    @Autowired
    DataSourceRepository dataSourceRepository;

    private Log logger = LogFactory.getLog(DataFileServiceHelper.class);

    @Async
    public void refreshRelatedQueries(DataFile dataFile) {
        var views = viewService.search(dataFile.getName(), dataSourceRepository.getCurrentName());
        for ( var view : views ) {
            try {
                viewService.save(view);
                viewService.postSave(view);
            } catch(Exception e) {
                logger.error("Error refreshing view", e);
            }
        }
    }
}

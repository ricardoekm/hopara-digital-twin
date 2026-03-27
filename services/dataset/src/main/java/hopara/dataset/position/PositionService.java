package hopara.dataset.position;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewStatsService;

@Component
@Transactional
public class PositionService {
    private Log logger = LogFactory.getLog(PositionService.class);

    @Autowired
    ViewStatsService viewStatsService;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    PositionRepository positionRepository;

    public View createPositionView(View view) {
        try { 
            if ( !view.hasPrimaryKey() ) {
                return null;
            }

            var positionTable = new PositionTable(view.getDataSourceName(), view.getName());
            var positionView = new PositionView(view, positionTable);

            if ( positionView.shouldCreate() ) {
                // Position is always saved in hopara data source
                var currentName = dataSourceRepository.getCurrentName();
                try{
                    dataSourceRepository.setCurrentName(DataSource.DEFAULT_NAME);
                    positionRepository.createPositionView(positionTable, positionView);
                } finally {
			        dataSourceRepository.setCurrentName(currentName);
		        } 

                return positionView;
            }
        } catch(Exception e) {
            logger.error("Error creating position table", e);
        }

        return null;
    }
}

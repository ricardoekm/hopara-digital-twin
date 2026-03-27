package hopara.dataset.column;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.filter.Filters;
import hopara.dataset.stats.column.ColumnStatsRepository;
import hopara.dataset.transform.TransformFactory;
import hopara.dataset.transform.TransformKey;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewRepository;

@Component
@Transactional(readOnly = true)
public class ColumnService {
	@Autowired 
	ColumnRepository columnRepository;	

	@Autowired 
	ColumnValuesRepository columnValuesRepository;

	@Autowired 
	ColumnStatsRepository columnStatsRepository;
	
	@Autowired 
	ViewRepository viewRepository;

	@Autowired
	QueryColumnRepository queryColumnRepository;
	
	public List<Object> getValues(ViewKey viewKey, String columnName, Filters filters, Integer limit) {
		return columnValuesRepository.getValues(viewRepository.find(viewKey), columnName, filters, limit);
	}

	public Columns getColumns(ViewKey viewKey) {
		var view = viewRepository.find(viewKey);
		return view.getColumns();
	}

	public Columns getColumns(TransformKey transformKey) {
		var transform = TransformFactory.getFromType(transformKey.getType());
		var view = viewRepository.find(transformKey.getViewKey());
		return transform.getColumns(view.getColumns());
	}
    
	@Transactional
	@Async
    public void refreshStats(ViewKey viewKey) {
        columnStatsRepository.refreshStats(viewRepository.find(viewKey));
    }

	@Transactional
	@Async
    public void refreshStats(View view) {
        columnStatsRepository.refreshStats(view);
    }
}

package hopara.dataset.view;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.column.ColumnRepository;
import hopara.dataset.column.ColumnService;
import hopara.dataset.column.QueryColumnService;
import hopara.dataset.database.Database;
import hopara.dataset.notification.NotificationService;
import hopara.dataset.position.PositionService;
import hopara.dataset.primarykey.PrimaryKeyFinder;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.table.TableRepository;

@Component
@Transactional
public class ViewService {
    @Autowired
    ViewRepository viewRepository;

    @Autowired
    ViewStatsService viewStatsService;
    
    @Autowired
    ColumnService columnService;

    @Autowired
    QueryColumnService queryColumnService;
    
    @Autowired
    ColumnRepository columnRepository;

    @Autowired
    TableRepository tableRepository;
    
    @Autowired
    ArrayConverter arrayConverter;

    @Autowired
    PositionService positionService;

    @Autowired
    PrimaryKeyFinder primaryKeyFinder;

    @Autowired
    NotificationService notifyService;

    @Autowired
	Database database;

    // If rename also rename the pointcut in SetCurrentDataSourceAdvice.java
    public Views upsert(View view, Boolean fillPrimaryKey) {
        var views = new Views();

        view.setDatabaseClass(database.getDbClass());                   
        view.setColumns(queryColumnService.getFromQueryExecution(view.getSqlQuery()));

        // Some validations require the columns to be already filled
        viewRepository.validate(view);

        if ( fillPrimaryKey ) {
            if ( !view.hasPrimaryKey() ) {
                var column = primaryKeyFinder.find(view);
                if ( column != null ) {
                    view.setPrimaryKeyName(column.getName());
                }
            }
        }

        viewRepository.upsert(view);
        views.add(view);

        var positionView = positionService.createPositionView(view);
        if ( positionView != null ) {
            views.add(positionView);
        }

        notifyService.notifyQueryChanged();
        return views;
    } 

    // Called inside recovery flow which is read only e has potential rollback/exception
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void refresh(ViewKey viewKey) {
        var view = find(viewKey);
        save(view);
    }

    @Async
    public CompletableFuture<Void> asyncSave(View view) {
        this.save(view);

        return CompletableFuture.completedFuture(null);
    }

    public Views save(View view) { 
        return upsert(view, false);
    }

    // Actions that require the save transaction to be commited because it will run async
    public void postSave(View view) {
        viewStatsService.refreshStats(view);
        columnService.refreshStats(view);
    }

    @Transactional(readOnly = true)
    public View find(ViewKey viewKey) {
        return viewRepository.find(viewKey);
    }

    @Transactional(readOnly = true)
    public View findWithTables(ViewKey viewKey) {
        var view = viewRepository.find(viewKey);
        view.setTables(viewRepository.getTables(view));
        return view;
    }
    
    public Views find(String dataSourceName) {
        if ( dataSourceName == null ) {
            return viewRepository.find();
        }
        else {
            return viewRepository.findByDataSource(dataSourceName);
        }
    }

    public Views search(String queryText, String dataSourceName) {
        return viewRepository.search(queryText, dataSourceName);
    }

    public Boolean has(ViewKey viewKey) {
        return viewRepository.has(viewKey);
    }

    @Transactional(readOnly = true)
    public List<ViewKey> findAllKeys(String dataSourceName) {
		var viewKeys = new ArrayList<ViewKey>();
		for ( var view : find(dataSourceName) ) {
			viewKeys.add(new ViewKey(view.getDataSourceName(), view.getName()));
		}

        Collections.sort(viewKeys);

        return viewKeys;
    }
    
    public void delete(ViewKey viewKey) {
        // We try to fetch the object so if not found returns 404
        viewRepository.delete(viewRepository.find(viewKey));           
        notifyService.notifyQueryChanged();
    }
}

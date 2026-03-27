package hopara.dataset.position;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.column.QueryColumnService;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableService;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewRepository;

@Component
public class PositionRepository {
    @Autowired
    ViewRepository viewRepository;

    @Autowired
    QueryColumnService queryColumnService;

    @Autowired
    TableService tableService;

    @Autowired
    PositionHistoryRepository positionHistoryRepository;

    private void createPositionTable(Table positionTable) {
        tableService.save(positionTable);
        tableService.createIndex(positionTable.getSqlName(), PositionColumns.PRIMARY_KEY_COLUMN_NAME);

        var uniqueColumns = new ArrayList<String>();
        uniqueColumns.add(PositionColumns.PRIMARY_KEY_COLUMN_NAME);
        uniqueColumns.add(PositionColumns.SCOPE_COLUMN_NAME);
        uniqueColumns.add(PositionColumns.TENANT_COLUMN_NAME);
        tableService.createUniqueConstraint(positionTable.getSqlName(), uniqueColumns);
    }

  
    // To always use Hopara DS
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createPositionView(Table positionTable, View positionView) {
        if ( !tableService.has(positionTable.getKey()) ) {
            createPositionTable(positionTable);
        }

        if ( !viewRepository.has(positionView.getKey()) ) {
            var columns = queryColumnService.getFromQueryExecution(positionView.getSqlQuery());
            positionView.addColumns(columns);
            viewRepository.upsert(positionView);
        }

        positionHistoryRepository.createHistoryTable(positionTable);
    }
}

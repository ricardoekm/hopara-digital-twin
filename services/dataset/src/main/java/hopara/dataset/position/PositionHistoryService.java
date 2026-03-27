package hopara.dataset.position;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.filter.Filters;
import hopara.dataset.table.TableRepository;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewService;

@Transactional
@Component
public class PositionHistoryService {
    @Autowired
    PositionHistoryRepository positionHistoryRepository;

    @Autowired
    TableRepository tableRepository;

    @Autowired
    ViewService viewService;

    public List<String> rollback(ViewKey positionViewKey, Object date, Filters filters) {
        if ( !PositionView.isPositionView(positionViewKey) ) {
            throw new IllegalArgumentException("Rollback only allowed for position views.");
        }

        var positionView = viewService.find(positionViewKey);
        var positionTable = tableRepository.find(positionView.getWriteTableKey());
        return positionHistoryRepository.rollback(positionTable, date, filters);
    }
}

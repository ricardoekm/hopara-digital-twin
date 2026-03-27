package hopara.dataset.view;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ViewStatsService {

    @Autowired
    ViewStatsRepository viewStatsRepository;

    @Transactional
    @Async
    public void refreshStats(View view) {
        viewStatsRepository.refreshStats(view);
    }
}

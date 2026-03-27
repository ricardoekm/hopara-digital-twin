package hopara.dataset.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadResponse;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewRepository;

@Component
public class SearchService {

    @Autowired
    ViewRepository viewRepository;

    @Autowired
    SearchRepository searchRepository;

    @Transactional(readOnly = true)
    public RowReadResponse search(ViewKey viewKey, String term, Filters jwtFilters, Pagination pagination) {
        var view = (View)viewRepository.find(viewKey);
        var rows = searchRepository.search(view, term, jwtFilters, pagination);

        var response = new RowReadResponse();
        response.setRows(rows);
        response.setColumns(view.getColumns());
        
        return response;
    }
}

package hopara.dataset.web.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadResponse;
import hopara.dataset.search.SearchService;
import hopara.dataset.view.ViewKey;
import hopara.dataset.web.RowReadBaseController;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class SearchController extends RowReadBaseController {
	@Autowired 
	SearchService searchService;

    @GetMapping(value={"view/{viewName}/search"})
    public ResponseEntity<RowReadResponse> searchRows(@PathVariable("viewName") String viewName,
                                       	@RequestParam(value="dataSource") String dataSourceName,
										@RequestParam(value="term", required=false) String term,
										@RequestParam(value="filter", required=false) Filters requestFilters,
                                        @RequestParam(value="limit", required=false) Integer limit,
                                        @RequestParam(value="offset", required=false) Integer offset) throws Exception {  
        var filters = new Filters();
        filters.addAll(appendJwtFilters(requestFilters));

        if ( limit == null ) {
            limit = defaultFetchLimit;
        }

        var viewKey = new ViewKey(dataSourceName, viewName);
        var pagination = new Pagination(limit, offset);
        var response = searchService.search(viewKey, term, filters, pagination);

        var httpStatus = HttpStatus.OK;
        var hasMoreRows = response.getRows().size() > limit;
        if ( hasMoreRows ) {
            httpStatus = HttpStatus.PARTIAL_CONTENT;
            response.limitRows(limit);
        }
        
        return new ResponseEntity<RowReadResponse>(response, getResponseHeaders(!hasMoreRows), httpStatus);
    }   	
}

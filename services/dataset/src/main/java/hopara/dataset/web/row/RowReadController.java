package hopara.dataset.web.row;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.RowNotFoundException;
import hopara.dataset.row.RowService;
import hopara.dataset.row.read.DistanceSort;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadResponse;
import hopara.dataset.transform.NullTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.view.ViewKey;
import hopara.dataset.web.Response;
import hopara.dataset.web.RowReadBaseController;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden()
public class RowReadController extends RowReadBaseController {
    @Autowired
    RowService rowService;

    @GetMapping(value={"view/{viewName}/row"})
    public ResponseEntity<RowReadResponse> getRows(@PathVariable("viewName") String viewName,
                                        @RequestParam(value="dataSource") String dataSourceName,
                                        @RequestParam(value="transform", required=false) Transform transform,
                                        @RequestParam(value="filter", required=false) Filters requestFilters,
                                        @RequestParam(value="distanceSort", required=false) DistanceSort distanceSort,
                                        @RequestParam(value="limit", required=false) Integer limit,
                                        @RequestParam(value="offset", required=false) Integer offset,
                                        @RequestParam(value="calculateStats", required=false) Boolean calculateStats) throws Exception {  
        var filters = new Filters();
        filters.addAll(appendJwtFilters(requestFilters));

        if ( limit == null ) {
            limit = defaultFetchLimit;
        }

        if ( calculateStats == null ) {
            calculateStats = false;
        }

        if ( transform == null) {
            transform = new NullTransform();
        }

        var viewKey = new ViewKey(dataSourceName, viewName);
        var pagination = new Pagination(limit, offset);
        var response = rowService.find(viewKey, transform, filters, pagination, distanceSort, calculateStats);

        var httpStatus = HttpStatus.OK;
        var hasMoreRows = response.getRows().size() > limit;
        if ( hasMoreRows ) {
            httpStatus = HttpStatus.PARTIAL_CONTENT;
            response.limitRows(limit);
        }
        
        return new ResponseEntity<RowReadResponse>(response, getResponseHeaders(!hasMoreRows), httpStatus);
    }

    @GetMapping(value={"view/{viewName}/row/{rowId}"})
    public ResponseEntity<Object> getRow(@PathVariable("viewName") String viewName,
                                         @RequestParam(value="dataSource") String dataSourceName,
                                         @RequestParam(value="filter", required=false) Filters requestFilters,
                                         @PathVariable("rowId") Object rowId) throws Exception {  
        try {
            var filters = appendJwtFilters(requestFilters);                 
            var row = rowService.find(new ViewKey(dataSourceName, viewName), rowId, filters);        
            return new ResponseEntity<Object>(row, getResponseHeaders(false), HttpStatus.OK);
        }
        catch(RowNotFoundException e) {
            return new ResponseEntity<Object>(new Response(false, e.getName() + " not found"), getResponseHeaders(false), HttpStatus.NOT_FOUND);
        }
    }
}

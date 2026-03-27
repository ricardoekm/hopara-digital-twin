package hopara.dataset.web.column;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.ColumnService;
import hopara.dataset.column.Columns;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.FilterFactory;
import hopara.dataset.filter.Filters;
import hopara.dataset.transform.TransformKey;
import hopara.dataset.transform.TransformType;
import hopara.dataset.view.ViewKey;
import hopara.dataset.web.BaseController;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class ColumnController extends BaseController {
	@Autowired 
	ColumnService columnService;

	@Autowired
	FilterFactory filterFactory;
	
	@GetMapping(value={"view/{viewName}/column/{columnName}/value"})
	public List<Object> getColumnValues( @PathVariable("viewName") String viewName,
							   	  		 @PathVariable("columnName") String columnName,
										 @RequestParam(value="dataSource") String dataSourceName,
										 @RequestParam(value="filter", required=false) Filters requestFilters,
								  		 @RequestParam(value="filterTerm", required=false) String filterTerm,
								  		 @RequestParam(value="limit", required=false) Integer limit )  {

		var filters = new Filters();
		filters.addAll(appendJwtFilters(requestFilters));									
	    if ( filterTerm != null ) {
	        filters.add(filterFactory.create(columnName,filterTerm,Operator.PARTIAL_MATCH));
	    }
	    
		return columnService.getValues(new ViewKey(dataSourceName,viewName), SqlSanitizer.cleanString(columnName), filters, limit); 
	}
	
	@GetMapping(value={"view/{viewName}/column"})
	public Columns getColumns( @PathVariable("viewName") String viewName,
							   @RequestParam(value="dataSource") String dataSourceName)  {
		return columnService.getColumns(new ViewKey(dataSourceName,viewName));
	}

		
	@GetMapping(value={"view/{viewName}/transform/{transformType}/column"})
	public Columns getTransformColumns( @PathVariable("viewName") String viewName,
									   	@PathVariable("transformType") TransformType transformType,
							   		   	@RequestParam(value="dataSource") String dataSourceName)  {
		return columnService.getColumns(new TransformKey(dataSourceName,viewName,transformType));
	}

	@PostMapping(value={"view/{viewName}/refresh-stats"})
    public ResponseEntity<Response> refreshStats(@PathVariable("viewName") String viewName,
								 @RequestParam(value="dataSource") String dataSourceName) throws Exception {
        columnService.refreshStats(new ViewKey(dataSourceName,viewName));
		var response = new Response(true, "Accepted refresh stats for " + viewName);
        return new ResponseEntity<Response>(response, HttpStatus.ACCEPTED);
    } 
	    	
}

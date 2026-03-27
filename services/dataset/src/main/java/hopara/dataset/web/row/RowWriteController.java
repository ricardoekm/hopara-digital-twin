package hopara.dataset.web.row;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.filter.Filters;
import hopara.dataset.position.PositionHistoryService;
import hopara.dataset.row.Row;
import hopara.dataset.row.RowService;
import hopara.dataset.row.Rows;
import hopara.dataset.row.WriteResult;
import hopara.dataset.table.TableKey;
import hopara.dataset.view.ViewKey;
import hopara.dataset.web.BaseController;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@Tag(name="Row write")
public class RowWriteController extends BaseController {
	@Autowired
	RowService rowService;

    @Autowired
    PositionHistoryService positionHistoryService;
	
    private ResponseEntity<Response> getResponseFromResult(WriteResult result) {
        var response = new Response(result.getTotal() + " rows received. success: " + result.getSuccessCount() + ", failure or skipped: " + result.getFailureCount() + ".");
        
        var httpStatus = HttpStatus.OK;
        if (Objects.equals(result.getFailureCount(), result.getTotal()) && result.hasErrorMessage()) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        else if ( result.getFailureCount() > 0 ) {
            httpStatus = HttpStatus.ACCEPTED;
        }
        
        if ( result.getFailureCount() > 0 && result.hasErrorMessage() ) {
           response.appendMessage(" Error example: " + result.getErrorMessage());
        }
        
        return new ResponseEntity<>(response, httpStatus);
    }

    @Hidden()
	@PutMapping("view/{viewName}/rollback")
	public List<String> rollbackRows(@PathVariable("viewName") String viewName,
									             @RequestParam(value="dataSource") String dataSourceName,
                                                 @RequestBody RollbackRequest request) {
        return positionHistoryService.rollback(new ViewKey(dataSourceName,viewName), request.getDate(), appendJwtFilters(request.getFilters()));                               
    }

    @Hidden()
	@PostMapping("table/{tableName}/row")
	public ResponseEntity<Response>  insertRows(@PathVariable("tableName") String tableName,
												@RequestParam(value="dataSource") String dataSourceName,
                    						    @RequestBody List<Object> requestRows) {
		
		var rows = new Rows();
		for ( var object : requestRows ) {
			rows.add(new Row(object));
		}		
		
		var result = rowService.insert(new TableKey(dataSourceName,tableName), rows);
		return getResponseFromResult(result);
	}

    @Hidden()
	@PostMapping("view/{viewName}/row")
	public List<Object>  insertViewRows(@PathVariable("viewName") String viewName,
										@RequestParam(value="dataSource") String dataSourceName,
                    					@RequestBody List<Object> requestRows) {
		var rows = new Rows();
		for ( var object : requestRows ) {
			rows.add(new Row(object));
		}		
		
		return rowService.insert(new ViewKey(dataSourceName,viewName), rows, getJwtFilters());
	}

    @Operation(summary = "Writes or updates data to a specific row identified by the table in the data source")
	@PostMapping(value={"table/{tableName}/row/{rowId}"})
	public ResponseEntity<Response> upsertTableRow(
            @Schema(description="The name of the query (view) to write to")
            @PathVariable("tableName")
            String tableName,

            @Schema(description="The unique identifier of the row to write to")
            @PathVariable("rowId")
            Object rowId,

            @Schema(description="The name of the data source to write to")
            @RequestParam(value="dataSource")
            String dataSourceName,

            @Schema(description="A JSON list of filters to apply to the view before writing in it", example="```[{\"column\":\"column1\",\"values\":[\"value1\"],\"comparisonType\":\"EQUALS\"}]```")
            @RequestParam(value="filter", required=false)
            Filters requestFilters,

            @Schema(description="A key-value pair of the data to write to the row", example="{\"column1\":\"value1\",\"column2\":\"value2\"}")
            @RequestBody
            Object values
        ) {
        var row = new Row(values);
		row.setId(rowId);
		
		var result = rowService.save(new TableKey(dataSourceName, tableName),row, appendJwtFilters(requestFilters));
        return getResponseFromResult(result);	
	}

    @Operation(summary = "Writes or updates data to a specific row identified by the query (view) in the data source")
	@PostMapping(value={"view/{viewName}/row/{rowId}"})
	public ResponseEntity<Response> saveRow(
            @Schema(description="The name of the query (view) to write to")
            @PathVariable("viewName")
            String viewName,

            @Schema(description="The unique identifier of the row to write to")
            @PathVariable("rowId")
            Object rowId,

            @Schema(description="The name of the data source to write to")
            @RequestParam(value="dataSource")
            String dataSourceName,

            @Schema(description="A JSON list of filters to apply to the view before writing in it", example="```[{\"column\":\"column1\",\"values\":[\"value1\"],\"comparisonType\":\"EQUALS\"}]```")
            @RequestParam(value="filter", required=false)
            Filters requestFilters,

            @Schema(description="A key-value pair of the data to write to the row", example="{\"column1\":\"value1\",\"column2\":\"value2\"}")
            @RequestBody
            Object values
        ) {
        var row = new Row(values);
		row.setId(rowId);
		
		var result = rowService.save(new ViewKey(dataSourceName, viewName),row, appendJwtFilters(requestFilters));
        return getResponseFromResult(result);	
	}	

    @Hidden()
	@DeleteMapping(value={"view/{viewName}/row/{rowId}"})
	public ResponseEntity<Response> deleteRow(@PathVariable("viewName") String viewName,
                						      @PathVariable("rowId") Object rowId,
											  @RequestParam(value="dataSource") String dataSourceName,
                						      @RequestParam(value="filter", required=false) Filters requestFilters) {		
		var result = rowService.delete(new ViewKey(dataSourceName, viewName), rowId, appendJwtFilters(requestFilters));
		return getResponseFromResult(result);
	}	
}

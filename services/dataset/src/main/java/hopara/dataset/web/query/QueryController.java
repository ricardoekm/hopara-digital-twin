package hopara.dataset.web.query;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.query.QueryMetadata;
import hopara.dataset.query.QueryRunResult;
import hopara.dataset.query.QueryService;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden()
public class QueryController {
    @Autowired
    QueryService queryService;

    @PostMapping("query")
	public QueryRunResult runQuery(@Valid @RequestBody RunQueryRequest request) throws Exception {
        return queryService.run(request.getDataSource(), request.getQuery());
	}  

    @PostMapping("validate-query")
	public void validateQuery(@Valid @RequestBody RunQueryRequest request) throws Exception {
        queryService.validate(request.getDataSource(), request.getQuery());
	} 

    @PostMapping("query-metadata")
	public QueryMetadata getQueryMetadata(@Valid @RequestBody RunQueryRequest request) throws Exception {
        return queryService.getMetadata(request.getDataSource(), request.getQuery());
	}  
}

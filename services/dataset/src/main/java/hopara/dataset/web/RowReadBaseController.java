package hopara.dataset.web;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;

import hopara.dataset.web.debug.Debugger;

public class RowReadBaseController extends BaseController {
	@Autowired
    @Qualifier("defaultFetchLimit")
    protected Integer defaultFetchLimit;

    protected HttpHeaders getResponseHeaders(Boolean lastPage) {
        var headers = new HttpHeaders();
        if ( Debugger.isDebugging() &&  Debugger.hasQuery() ) {
            headers.add("query", Debugger.getQuery());
            headers.add("params", Debugger.getParams().toString());
        }

        headers.add("last-page",lastPage.toString());
        
        var exposedHeaders = new ArrayList<String>();
        exposedHeaders.add("ETag");
        exposedHeaders.add("last-page");
        headers.setAccessControlExposeHeaders(exposedHeaders);
        return headers;
    }
}

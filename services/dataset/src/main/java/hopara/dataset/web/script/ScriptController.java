package hopara.dataset.web.script;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.script.ScriptService;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class ScriptController {
    @Autowired
    ScriptService scriptService;

    @PostMapping("script")
	public Response runScript(@RequestParam(value="dataSource") String dataSourceName,
                              @RequestBody String script) {
        if ( !"hopara".equals(dataSourceName) ) {
            throw new RuntimeException("Only 'hopara' data source is allowed");
        }

		scriptService.run(script);
		return new Response(true, "Success!");		
	}
}

package hopara.dataset.web;

import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.cache.CacheService;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class Controller {
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	private CacheService cacheService;

	@GetMapping("/health")
	public HashMap<String,Object> health() {
	    String version = "no version available";
	    try {
	        BuildProperties buildProperties = context.getBean(BuildProperties.class);
	        version = buildProperties.getVersion();
	    }
	    catch(Exception e) {  }
	    
		var values = new HashMap<String,Object>();
		values.put("message", "I'm healthy! :)");
		values.put("version", version);

		return values;
	}

    @GetMapping("/ping")
	public ResponseEntity<String> ping() {
        var headers = new HttpHeaders();
        headers.add("Pod-Name", System.getenv("HOSTNAME"));
        return new ResponseEntity<String>("Pong!", headers, HttpStatus.OK);
    }

	@PostMapping("/clear-cache")	
    public String clearCache() {
	    cacheService.clear();
        cacheService.clear2();
	    return "Cache cleared";
    }
}
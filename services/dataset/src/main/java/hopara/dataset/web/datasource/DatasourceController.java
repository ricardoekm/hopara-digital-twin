package hopara.dataset.web.datasource;

import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceService;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden()
public class DatasourceController {
    @Autowired
    DataSourceService dataSourceService;
    
    @PostMapping("data-source")
    public Response save(@Valid @RequestBody DataSource dataSource) throws Exception {
        dataSourceService.save(dataSource);
        return new Response(true, "Datasource successfully created");        
    }

    @PostMapping("clone-data-source")
    public Response clone(@RequestBody Map<String,String> request) throws Exception {
        dataSourceService.clone(request.get("source"), request.get("target"));
        return new Response(true, "Datasource successfully created");        
    }

    @PutMapping("data-source/{dataSourceName}")
    public Response update(@Valid @RequestBody DataSource dataSource,
                          @PathVariable("dataSourceName") String name,
                          @RequestParam(value="persist", required=false) Boolean persist) throws Exception {
        
        
        dataSource.setName(name);
        dataSourceService.save(dataSource, persist);

        if ( persist == null || persist == true) {
            return new Response(true, "Datasource successfully created!");        
        }
        else {
            return new Response(true, "Datasource successfully validated!");        
        }        
    }


    @GetMapping("data-source")
    public Iterable<DataSource> list() throws Exception {
        return dataSourceService.list();
    }

    @GetMapping("data-source/{dataSourceName}")
    public DataSource get(@PathVariable("dataSourceName") String name) throws Exception {
        return dataSourceService.findNoPassword(name);
    }

    @DeleteMapping("data-source/{dataSourceName}")
    public void delete(@PathVariable("dataSourceName") String name) throws Exception {
        dataSourceService.delete(name);
    }

    // Used when deleting the organization
    @DeleteMapping("data-source")
    public void deleteAll() throws Exception {
        dataSourceService.deleteAll();
    }
}

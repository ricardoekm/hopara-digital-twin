package hopara.dataset.web.entitytable;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.entitytable.EntityService;
import hopara.dataset.entitytable.EntityTable;
import hopara.dataset.web.BaseController;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class EntityController extends BaseController {
    
    @Autowired
    private EntityService entityService;

    @PostMapping("entity-table/{name}")
	public Response save(@PathVariable("name") String name, 
                         @RequestParam(value="createView", required=false) boolean createView) throws Exception {
		var createdViews = entityService.save(name, createView);

        return new SaveEntityTableResponse(true, "Entity table saved!", createdViews);	
	}

    @DeleteMapping("entity-table/{name}")
	public Response delete(@PathVariable("name") String name) throws Exception {
		entityService.delete(name);

        return new Response(true, "Entity deleted!");	
	}

    @GetMapping("entity-table")
	public List<EntityTable> list() throws Exception {
		return entityService.find();
	}
}

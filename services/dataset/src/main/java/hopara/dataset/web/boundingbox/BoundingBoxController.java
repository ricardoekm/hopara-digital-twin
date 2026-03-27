package hopara.dataset.web.boundingbox;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.boundingbox.BoundingBox;
import hopara.dataset.boundingbox.BoundingBoxService;
import hopara.dataset.filter.Filters;
import hopara.dataset.view.ViewKey;
import hopara.dataset.web.BaseController;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class BoundingBoxController extends BaseController {
    @Autowired
    BoundingBoxService boundingBoxService;

	@GetMapping(value={"view/{viewName}/bounding-box"})
	public BoundingBox getBoundingBox( @PathVariable("viewName") String viewName,
										 @RequestParam(value="dataSource") String dataSourceName,
                                         @RequestParam(value="xColumn") String xColumn,
                                         @RequestParam(value="yColumn") String yColumn,
										 @RequestParam(value="filter", required=false) Filters requestFilters )  {

		var filters = new Filters();
		filters.addAll(appendJwtFilters(requestFilters));									
        return boundingBoxService.getBoundingBox(new ViewKey(dataSourceName, viewName), xColumn, yColumn, filters);
	}
}

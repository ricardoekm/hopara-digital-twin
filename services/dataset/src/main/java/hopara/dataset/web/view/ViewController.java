package hopara.dataset.web.view;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.transform.TransformFactory;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewService;
import hopara.dataset.view.Views;
import hopara.dataset.web.Response;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden()
public class ViewController {
	@Autowired
	ViewService viewService;

	@Autowired
	ObjectMapper objectMapper;
	
	@PostMapping("view/{viewName}")
	public Response createView(@PathVariable("viewName") String viewName,
							   @RequestParam(value="fillPrimaryKey",required = false) Boolean fillPrimaryKey,
							   @Valid @RequestBody View view) throws Exception {		
		view.setName(viewName);

		if ( fillPrimaryKey == null ) {
			fillPrimaryKey = false;
		}

		viewService.upsert(view, fillPrimaryKey);
		viewService.postSave(view);

		return new CreateViewResponse(true, "View successfully created", view.getName());		
	} 	
	
	private List<ViewKey> getViewsKeys(Views views) {
		var viewKeys = new ArrayList<ViewKey>();
		for ( var view : views ) {
			viewKeys.add(new ViewKey(view.getDataSourceName(), view.getName()));
		}

        Collections.sort(viewKeys);

        return viewKeys;
	}

	@GetMapping("view")
	public Object getViews(@RequestParam(value="dataSource", required = false) String dataSourceName,
							   @RequestParam(value="fullResponse", required = false) Boolean fullResponse) throws Exception {
		var views = viewService.find(dataSourceName);
		if ( fullResponse == null || fullResponse == false ) {
			return getViewsKeys(views);
		}

		var response = new ArrayList<Map<String,Object>>();
		for ( var view : views ) {
			response.add(viewToMap(view, fullResponse));
		}

		return response;
	}

	private List<Object> getTransforms(View view) {
		var transforms = new ArrayList<Object>();
		
		for ( var transform : TransformFactory.getAll() ) {
			var transformMap = new HashMap<String,Object>();
			transformMap.put("type", transform.getType().toString());
			transformMap.put("columns", transform.getColumns(view.getColumns()));
			transforms.add(transformMap);
		}

		return transforms;
	}
	
	private Map<String,Object> viewToMap(View view, Boolean fullReponse) {
		var map = objectMapper.convertValue(view, new TypeReference<Map<String, Object>>() {});

		if ( fullReponse == null || fullReponse == false ) {
			map.put("columns", null);
			map.put("transforms", null);
		}
		else {
			map.put("transforms", getTransforms(view));
		}

		return map;
	}

	@GetMapping("view/{viewName}")
	public Map<String,Object> getView(@PathVariable("viewName") String viewName,
						@RequestParam(value="dataSource") String dataSourceName, 
						@RequestParam(value="fullResponse", required = false) Boolean fullReponse) throws Exception {
		var view = viewService.find(new ViewKey(dataSourceName, viewName));
		return viewToMap(view, fullReponse);
	}
	
	@DeleteMapping("view/{viewName}")
	public Response deleteView(@PathVariable("viewName") String viewName,
							   @RequestParam(value="dataSource") String dataSourceName) throws Exception {
		 viewService.delete(new ViewKey(dataSourceName, viewName));
		 
		 return new Response(true, "View " + viewName + " deleted!");
	}
}

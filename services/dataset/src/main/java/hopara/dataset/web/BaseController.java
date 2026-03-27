package hopara.dataset.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.filter.FilterFactory;
import hopara.dataset.filter.Filters;
import hopara.dataset.web.security.JwtService;

@RestController
public class BaseController {
    @Autowired
    FilterFactory filterFactory;
    
    @Autowired
    JwtService jwtService;
    
    protected Filters getJwtFilters() {
        var filters = new Filters();
        // JWT filters need to always come first, to enforce the filters
        @SuppressWarnings("unchecked")
        var filterMaps = (List<Map<String,Object>>)jwtService.getClaim("filters");
        
        if ( filterMaps != null ) {
            var jwtFilters = filterFactory.fromMapList(filterMaps);
            filters.addAll(jwtFilters);
        }

        for ( var filter : filters ) {
            filter.setSecurity(true);
        }

        return filters;
    }

    protected Filters appendJwtFilters(Filters sourceFilters) {
        var filters = getJwtFilters();
        
        if ( sourceFilters != null ) {
            filters.addAll(sourceFilters);     
        }
    
        return filters;
    }
}

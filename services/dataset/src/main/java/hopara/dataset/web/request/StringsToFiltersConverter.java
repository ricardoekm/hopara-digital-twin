package hopara.dataset.web.request;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import hopara.dataset.filter.FilterFactory;
import hopara.dataset.filter.Filters;

@Component
public class StringsToFiltersConverter implements Converter<String[], Filters> {
    private Log logger = LogFactory.getLog(StringsToFiltersConverter.class);

	@Autowired
	FilterFactory filterFactory;

	public StringsToFiltersConverter() {}

	public StringsToFiltersConverter(FilterFactory filterFactory) {
		this.filterFactory = filterFactory;
	}
	
	@Override
	public Filters convert(String[] source) {
		try {
			var filters = new Filters();
			for ( var filtersString : source ) {
				var filter = filterFactory.fromJsonObject(filtersString);
                filters.add(filter);
			}
			
			return filters;
		}
		catch(Exception e) {
			logger.error("Failed to convert Strings to Filters", e);
			throw new RuntimeException(e);
		}
	} 

}

package hopara.dataset.web.request;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;

import hopara.dataset.filter.Filter;
import hopara.dataset.filter.FilterFactory;
import hopara.dataset.filter.Filters;

@Component
public class StringToFiltersConverter implements Converter<String, Filters> {

	@Autowired
	private FilterFactory filterFactory;
	
    private Log log = LogFactory.getLog(StringToFiltersConverter.class);

    public StringToFiltersConverter() { }

	public StringToFiltersConverter(FilterFactory filterFactory) {
		this.filterFactory = filterFactory;
	}
    
	private Filters convertElement(String source) throws JsonProcessingException, JsonMappingException {
		var filters = new Filters();
		Filter filter = filterFactory.fromJsonObject(source);
        filters.add(filter);		
		return filters;
	} 
	
	private Filters convertList(String source) throws JsonProcessingException, JsonMappingException {
		return filterFactory.fromJsonArray(source);
	} 
    
	@Override
	public Filters convert(String source) {		
		try {
			try {
				return convertElement(source);
			} catch(MismatchedInputException e) {
				return convertList(source);
			}
		}
		catch(Exception e) {
			log.error("Unable to parse to filters, this request will ignore filters: " + source, e);			
		}
		
		return new Filters();
	}
}

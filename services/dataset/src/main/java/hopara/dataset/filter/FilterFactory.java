package hopara.dataset.filter;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.datasource.DataSourceRepository;

@Component
public class FilterFactory {
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private DataSourceRepository dataSourceRepository;

    public FilterFactory() {}
    
    public FilterFactory(ObjectMapper objectMapper, DataSourceRepository dataSourceRepository) {
        this.objectMapper = objectMapper;
        this.dataSourceRepository = dataSourceRepository;
    }

    @SuppressWarnings("unchecked")
    private void uncompressValues(Filter filter) {
        try {
            if ( filter.hasCompressedValues() ) {
                var uncompressedValues = Gzip.uncompress(filter.getCompressedValues());
                var parsedValues = objectMapper.readValue(uncompressedValues,List.class);
                filter.setValues((List<Object>)parsedValues);
            }
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Filter fromJsonObject(String jsonObject) throws JsonMappingException, JsonProcessingException {
        var filter = objectMapper.readValue(jsonObject, Filter.class);  
        filter.setQuoteIdentifiers(dataSourceRepository.getCurrent().shouldQuoteIdentifiers());	
        uncompressValues(filter);
        return filter;
    }

    public Filters fromJsonArray(String jsonArray) throws JsonMappingException, JsonProcessingException {
        var filters = new Filters();
        Filter[] filtersArray = objectMapper.readValue(jsonArray, Filter[].class);
        filters.addAll(Arrays.asList(filtersArray));
        
        for ( var filter : filters ) {
            filter.setQuoteIdentifiers(dataSourceRepository.getCurrent().shouldQuoteIdentifiers());
            uncompressValues(filter);
        }
        
        return filters;
    }

    public Filters fromMapList(List<Map<String,Object>> mapList) {
        var filters = new Filters();

        var filtersArray = objectMapper.convertValue(mapList, Filter[].class);

        filters.addAll(Arrays.asList(filtersArray));
        
        for ( var filter : filters ) {
            filter.setQuoteIdentifiers(dataSourceRepository.getCurrent().shouldQuoteIdentifiers());
            uncompressValues(filter);
        }

        return filters;
    }

    public Filter create(String columnName, Object value, Operator comparisonType) {
        var filter = new Filter(columnName, value, comparisonType);
        filter.setQuoteIdentifiers(dataSourceRepository.getCurrent().shouldQuoteIdentifiers());
        return filter;
    }
    
}

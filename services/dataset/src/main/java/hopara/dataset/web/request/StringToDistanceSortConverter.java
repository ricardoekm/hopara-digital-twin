package hopara.dataset.web.request;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.row.read.DistanceSort;

@Component
public class StringToDistanceSortConverter implements Converter<String, DistanceSort> {

	@Autowired
	private ObjectMapper objectMapper;

    public StringToDistanceSortConverter() { }
    public StringToDistanceSortConverter(ObjectMapper objectMapper) { this.objectMapper = objectMapper; }
    
	@Override
	public DistanceSort convert(String source) {		
		try {
			return objectMapper.readValue(source, DistanceSort.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}

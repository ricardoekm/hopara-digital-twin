package hopara.dataset.web.request;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.transform.Transform;

@Component
public class StringToTransformConverter implements Converter<String, Transform> {

	@Autowired
	private ObjectMapper objectMapper;

    public StringToTransformConverter() { }
    public StringToTransformConverter(ObjectMapper objectMapper) { this.objectMapper = objectMapper; }
    
	@Override
	public Transform convert(String source) {		
		try {
			return objectMapper.readValue(source, Transform.class);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}

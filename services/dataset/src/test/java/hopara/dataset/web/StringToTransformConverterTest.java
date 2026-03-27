package hopara.dataset.web;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import hopara.dataset.transform.TransformType;
import hopara.dataset.web.request.StringToTransformConverter;

public class StringToTransformConverterTest {

    @Test
    void convert_transform_params() {
        var timeTransform = "{\"type\":\"ROOM_CLUSTER\"}";
        
        var converter = new StringToTransformConverter(new ObjectMapper());
        var transform = converter.convert(timeTransform);

        assertEquals(TransformType.ROOM_CLUSTER, transform.getType());
    }
}

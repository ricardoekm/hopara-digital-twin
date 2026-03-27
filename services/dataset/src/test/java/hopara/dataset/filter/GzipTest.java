package hopara.dataset.filter;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class GzipTest {
    
    @Test
    public void uncompress() {
        var compressed = "H4sIAAAAAAAAA3N0cgYASAODowMAAAA=";
        var uncompressed = Gzip.uncompress(compressed);
        assertEquals("ABC", uncompressed);
    }
}

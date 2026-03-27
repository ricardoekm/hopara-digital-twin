package hopara.dataset.datafile;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class DataFilePathTest {
    @Test
    public void get_dir_path() {
        var path = new DataFilePath("bucket", "hopara_io", "duck");
        assertEquals("hopara_io/duck/", path.getRelativeDir());
    }
}

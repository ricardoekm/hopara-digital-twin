package hopara.dataset.datafile;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class DataFileTest {

    DataFile dataFile;
    DataFilePath path;

    @BeforeEach
    public void setUp() {
        path = new DataFilePath("dataset-data-files", "hopara_io", "duck");
        dataFile = new DataFile("my_asset", "assets.csv", path);
    }

    @Test
    public void sanitizeTableName() {
        dataFile = new DataFile("my-asset", "assets.csv", path);
        assertEquals("myasset", dataFile.getName());
    }

    @Test
    public void get_file_path() {
        assertEquals("hopara_io/duck/my_asset.csv", dataFile.getRelativeFilePath());
    }

    @Test
    public void get_mime_type() {
        assertEquals("text/csv", dataFile.getMimeType());
    }

    @Test
    public void get_name() {
        assertEquals("my_asset", dataFile.getName());
    }
}

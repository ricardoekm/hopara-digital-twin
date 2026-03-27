package hopara.dataset.datafile;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class DataFilesTest {
    @Test
    public void find_by_base_name() {
        var dataFiles = new DataFiles();

        var dataFile = new DataFile("abc.cvb", new DataFilePath("bucket", "hopara_io", "duck"));
        dataFiles.add(dataFile);

        var returnedDataFile = dataFiles.findByName("abc");
        assertEquals(dataFile, returnedDataFile);
    }
}

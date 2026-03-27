package hopara.dataset.datafile;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;


import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;

import hopara.dataset.datafile.fs.FSDataFileRepository;

public class FSDataFileRepositoryTest{
    @Test
    public void save_and_delete_data_file() {
        var tempDir = System.getProperty("java.io.tmpdir");

        var dataFile = new DataFile("assets.csv", new DataFilePath(tempDir, "hopara", "assets"));
        dataFile.setInputStream(new java.io.ByteArrayInputStream("id,name\n1,Asset 1".getBytes()));

        var repository = new FSDataFileRepository();
        repository.save(dataFile);
        assertTrue(Files.exists(Path.of(dataFile.getFilePath())));
        
        repository.delete(dataFile);
        assertFalse(Files.exists(Path.of(dataFile.getFilePath())));
    }
}

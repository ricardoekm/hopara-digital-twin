package hopara.dataset.datafile.fs;

import java.io.*;
import java.nio.file.*;
import java.util.stream.Collectors;
import hopara.dataset.NotFoundException;
import hopara.dataset.datafile.DataFile;
import hopara.dataset.datafile.DataFilePath;
import hopara.dataset.datafile.DataFileRepository;
import hopara.dataset.datafile.DataFiles;
import hopara.dataset.datafile.FileContent;

public class FSDataFileRepository implements DataFileRepository {

    private DataFile findSameNameWithAnotherExtension(DataFile dataFile) {
        var files = list(dataFile.getPath());
        for (var file : files) {
            if (file.hasSameName(dataFile.getName()) && !file.hasExtension(dataFile.getExtension())) {
                return file;
            }
        }
        return null;
    }

    @Override
    public void save(DataFile dataFile) {
        try {
            Files.createDirectories(Path.of(dataFile.getPath().getDir()));
            Path filePath = Path.of(dataFile.getFilePath());
            try (InputStream in = dataFile.getInputStream()) {
                Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
            }
            // Remove duplicate with same name but different extension
            var duplicateFile = findSameNameWithAnotherExtension(dataFile);
            if (duplicateFile != null) {
                delete(duplicateFile);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(DataFile dataFile) {
        Path filePath = Path.of(dataFile.getFilePath());
        if (!Files.exists(filePath)) {
            throw new NotFoundException(dataFile.getName());
        }
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public DataFile findByName(String name, DataFilePath path) {
        var dataFile = list(path).findByName(name);
        if (dataFile == null) {
            throw new NotFoundException(name);
        }
        return dataFile;
    }

    @Override
    public DataFiles list(DataFilePath path) {
        var dataFiles = new DataFiles();
        Path dir = Path.of(path.getDir());
        if (!Files.exists(dir)) return dataFiles;
        try {
            var files = Files.list(dir)
                .filter(Files::isRegularFile)
                .collect(Collectors.toList());
            for (var file : files) {
                String fileName = file.getFileName().toString();
                dataFiles.add(new DataFile(fileName, path));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return dataFiles;
    }

    @Override
    public FileContent getContent(DataFile dataFile) {
        Path filePath = Path.of(dataFile.getFilePath());
        try {
            InputStream in = Files.newInputStream(filePath);
            // Use DataFile's mime type
            return new FileContent(in, dataFile.getMimeType());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

package hopara.dataset.datafile;

import java.io.InputStream;

import org.apache.commons.io.FilenameUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import hopara.dataset.SqlSanitizer;

public class DataFile {

    String name;
    String extension;
    DataFilePath path;
    Long fileSize;
    InputStream inputStream;

    public DataFile(String fileName, DataFilePath dataFilePath) {
        this.name = FilenameUtils.getBaseName(fileName); 
        this.extension = FilenameUtils.getExtension(fileName);
        this.path = dataFilePath;
    }

    public DataFile(String name, String fileName, DataFilePath path) {
        this.name = name;
        this.extension = FilenameUtils.getExtension(fileName);
        this.path = path;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    @JsonIgnore
    public Long getFileSize() {
        return fileSize;
    }

    @JsonIgnore
    public InputStream getInputStream() {
        return inputStream;
    }

    public Boolean hasExtension(String extension) {
        return extension.equalsIgnoreCase(this.extension);
    }

    public String getExtension() {
        return this.extension;
    }

    private String getFileName() {
        return getName() + "." + this.extension;
    }

    @JsonIgnore
    public String getRelativeFilePath() {
        return path.getRelativeFilePath(getFileName());
    }

    @JsonIgnore
    public String getFilePath() {
        return path.getFilePath(getFileName());
    }

    public String getMimeType() {
        if ( extension.equals("csv") ) {
            return "text/csv";
        }
        else if ( extension.equals("json") ) {
            return "application/json";
        }

        return "text/plain";
    }

    public String getName() {
        return SqlSanitizer.cleanString(name).toLowerCase();
    }

    public Boolean hasSameName(String name) {
        return this.name.equalsIgnoreCase(SqlSanitizer.cleanString(name));
    }

    @JsonIgnore
    public String getBaseDir() {
        return path.getBaseDir();
    }

    public DataFilePath getPath() {
        return this.path;
    }
}

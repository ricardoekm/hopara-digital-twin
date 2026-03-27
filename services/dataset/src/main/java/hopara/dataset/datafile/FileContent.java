package hopara.dataset.datafile;

import java.io.InputStream;

public class FileContent {
    InputStream inputStream;
    String type;

    public FileContent(InputStream inputStream, String type) {
        this.inputStream = inputStream;
        this.type = type;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public String getType() {
        return type;
    }
}

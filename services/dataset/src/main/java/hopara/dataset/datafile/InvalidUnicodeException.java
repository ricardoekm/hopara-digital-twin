package hopara.dataset.datafile;

public class InvalidUnicodeException extends RuntimeException {
    public InvalidUnicodeException(Throwable cause) {
        super("The file contains invalid unicode characters. Please check the file encoding.");
    }
    
}

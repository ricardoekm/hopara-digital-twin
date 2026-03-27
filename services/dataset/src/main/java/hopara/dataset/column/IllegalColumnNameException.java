package hopara.dataset.column;

public class IllegalColumnNameException extends RuntimeException {
    String name;
    
    public IllegalColumnNameException(String name) {
        this.name = name;
    }

    @Override
    public String getMessage() {
        return "Column names should not contain \" or ;. Error found in: " + name;
    }
}

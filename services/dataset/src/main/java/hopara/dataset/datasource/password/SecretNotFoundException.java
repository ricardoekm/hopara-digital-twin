package hopara.dataset.datasource.password;

public class SecretNotFoundException extends RuntimeException {
    String name;

    public SecretNotFoundException(String name) {
        this.name = name;
    }

    @Override
    public String getMessage() {
        return "Secret " + name + " not found!";
    }
}

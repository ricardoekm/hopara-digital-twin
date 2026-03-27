package hopara.dataset.datasource.password;

public interface PasswordRepository {
    public String find(String name);
    public void save(String name, String password);
    public void delete(String name);
}

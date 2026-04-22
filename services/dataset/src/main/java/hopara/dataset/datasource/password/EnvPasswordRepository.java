package hopara.dataset.datasource.password;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

public class EnvPasswordRepository implements PasswordRepository {

    @Value("${env:dev}")
    private String env;

    @Autowired
    @Qualifier("passwordRepository")
    PasswordRepository passwordRepository;

    private Boolean isDevDatasource(String name) {
        return env.equalsIgnoreCase("dev") && 
               (name.equals("hopara" ) || name.equals("test_ds"));
    }

    private String getEnvKey(String name) {
        return "DATASOURCE_PASSWORD_" + name.toUpperCase();
    }

    private String getEnvPassword(String name) {
        return System.getenv(getEnvKey(name));
    }

    private Boolean hasEnvPassword(String name) {
        return StringUtils.hasText(getEnvPassword(name));
    }

    public String find(String name) {
        if ( isDevDatasource(name) ) {
            return "hopara";
        }

        if ( hasEnvPassword(name) ) {
            return getEnvPassword(name);
        }

        return passwordRepository.find(name);
    }

    public void save(String name, String password) {
        if ( isDevDatasource(name) || hasEnvPassword(name) ) {
            return;
        }

        passwordRepository.save(name, password);
    }

    public void delete(String name) {
        passwordRepository.delete(name);
    }
}

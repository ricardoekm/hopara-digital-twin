package hopara.dataset.datasource.password;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabasePasswordRepository implements PasswordRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public void save(String name, String password) {
        jdbcTemplate.update("UPDATE hp_data_sources SET password = ? WHERE name = ?", password, name);
    }

    @Override
    public String find(String name) {
        return jdbcTemplate.queryForObject("SELECT password FROM hp_data_sources WHERE name = ?", String.class, name);
    }

    @Override
    public void delete(String name) {
        jdbcTemplate.update("UPDATE hp_data_sources SET password = NULL WHERE name = ?", name);
    }
    
}

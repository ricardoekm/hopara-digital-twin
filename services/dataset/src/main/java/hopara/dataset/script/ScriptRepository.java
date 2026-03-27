package hopara.dataset.script;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional("dataTx")
public class ScriptRepository {
    @Autowired
    @Qualifier("dataJdbcTemplate")
    JdbcTemplate jdbcTemplate;

    public void run(String script) {
        jdbcTemplate.execute(script);
    }
}

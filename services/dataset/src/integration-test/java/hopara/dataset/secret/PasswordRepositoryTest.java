package hopara.dataset.secret;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.datasource.password.PasswordRepository;

public class PasswordRepositoryTest extends IntegrationTest {

    @Autowired
    PasswordRepository secretRepository;
    
    // Disabled due to secret manager dependency
    @Disabled @Test
    public void save_secret() {
        secretRepository.save("nome", "valor");
        assertEquals("valor", secretRepository.find("nome"));   
        
        secretRepository.save("nome", "valor_novo");
        assertEquals("valor_novo", secretRepository.find("nome"));
    }
}

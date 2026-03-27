package hopara.dataset.secret;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import hopara.dataset.datasource.password.Secret;

public class SecretTest {
    @Test
    public void secret_key_removes_special_chars() {
        var secret = new Secret("!sou_feliz", "valor");
        assertEquals("dataset_dev_sou_feliz", secret.getKey("dev"));
    }

    @Test
    public void secret_name_should_have_alphanumeric_chars() {
        assertThrows(IllegalArgumentException.class, () -> new Secret("!##", "valor"));
    }
}

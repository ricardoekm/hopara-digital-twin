package hopara.dataset.entitytable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.NotFoundException;

public class EntityRepositoryTest extends IntegrationTest {
    @Autowired
    EntityRepository entityTableRepository;

    @BeforeEach
    public void deleteTestObjects() {
        entityTableRepository.deleteAll();
    }

    @Test
    public void save_entity_table() {
        var entityTable = new EntityTable("test_entity_table");
        entityTableRepository.save(entityTable);

        var savedEntityTable = entityTableRepository.find("test_entity_table");
        assertEquals(entityTable.getName(), savedEntityTable.getName());
    }

    @Test
    public void has() {
        assertFalse(entityTableRepository.has("test_entity_table"));

        var entityTable = new EntityTable("test_entity_table");
        entityTableRepository.save(entityTable);

        assertTrue(entityTableRepository.has("test_entity_table"));
    }

    @Test
    public void save_twice_throws_exception() {
        var entityTable = new EntityTable("test_entity_table");
        entityTableRepository.save(entityTable);
        assertThrows(IllegalArgumentException.class, () -> entityTableRepository.save(entityTable));
    }

    @Test
    public void delete() {
        var entityTable = new EntityTable("test_entity_table");
        entityTableRepository.save(entityTable);

        entityTableRepository.delete("test_entity_table");
        assertThrows(NotFoundException.class, () -> entityTableRepository.find("test_entity_table"));
    }

    @Test
    public void list() {
        var entityTable = new EntityTable("test_entity_table");
        entityTableRepository.save(entityTable);

        var entityTables = entityTableRepository.find();
        assertEquals(1, entityTables.size());
        assertEquals(entityTable.getName(), entityTables.get(0).getName());
    }
}

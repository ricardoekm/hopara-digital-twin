package hopara.dataset.view;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.SQLException;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.row.RowIntegrationTest;

public class ViewStatsRepositoryTest extends RowIntegrationTest {
    @Autowired
    ViewStatsRepository viewStatsRepository;

    @Test
    public void calculate_row_count() throws SQLException {
        var galo = new HashMap<String, Object>();
        galo.put("nome", "Galo");
        saveRow(galo);

        var camargo = new HashMap<String, Object>();
        camargo.put("nome", "Camargo");
        saveRow(camargo);

        var view = getView();
        viewStatsRepository.refreshStats(view);

        assertEquals(2, view.getRowCount());
    }
}
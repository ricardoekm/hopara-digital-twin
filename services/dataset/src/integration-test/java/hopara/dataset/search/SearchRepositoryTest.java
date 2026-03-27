package hopara.dataset.search;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.row.read.Pagination;

public class SearchRepositoryTest extends RowIntegrationTest {

    @Autowired
    SearchRepository searchRepository;

    private Map<String,Object> getValues(String nome, String cidade) {
        var values = new HashMap<String,Object>();
        values.put("nome", nome);
        values.put("cidade", cidade);
        return values;
    }

    @Test
    public void test_search() {
        saveRow(getValues("galo", "Volta Redonda"));
        saveRow(getValues("galeto", "Volta Redonda"));

        var rows1 = searchRepository.search(getSavedView(), "galo", new Filters(), new Pagination(10));
        assertEquals(1, rows1.size());

        var rows2 = searchRepository.search(getSavedView(), "Gal", new Filters(), new Pagination(10));
        assertEquals(2, rows2.size());
    }

    @Test
    public void test_if_term_is_null_retrieve_everyone() {
        saveRow(getValues("galo", "Volta Redonda"));
        saveRow(getValues("galeto", "Volta Redonda"));

        var rows = searchRepository.search(getSavedView(), null, new Filters(), new Pagination(10));
        assertEquals(2, rows.size());
    }
}

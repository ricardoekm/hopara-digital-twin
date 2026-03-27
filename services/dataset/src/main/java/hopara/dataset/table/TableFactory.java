package hopara.dataset.table;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;

@Component
public class TableFactory {
    @Autowired
    DataSourceRepository dataSourceRepository;

    public Table create(String dataSourceName, String name) {
        var table = new Table(dataSourceName, name);
        table.setQuoteIdentifiers(dataSourceRepository.getCurrent().shouldQuoteIdentifiers());
        return table;
    }
}

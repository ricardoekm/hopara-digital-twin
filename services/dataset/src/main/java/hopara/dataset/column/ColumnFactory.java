package hopara.dataset.column;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;

@Component
public class ColumnFactory {
    @Autowired
	DataSourceRepository dataSourceRepository;

    private Boolean shouldQuoteIdentifiers() {
        if ( !dataSourceRepository.isCurrentSet() ) {
            return false;
        }
        
        return dataSourceRepository.getCurrent().shouldQuoteIdentifiers();
    }

    public Column create() {
        var column = new Column();
        column.setQuoteIdentifiers(shouldQuoteIdentifiers());
        return column;
    }

    public Column create(String name, ColumnType type) {
        var column = new Column(name, type);
        column.setQuoteIdentifiers(shouldQuoteIdentifiers());
        return column;    
    }
}

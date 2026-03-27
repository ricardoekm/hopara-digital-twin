package hopara.dataset.row.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;

@Component
public class ConverterExecutorFactory {

    @Autowired
    Database database;
    
    public ConverterExecutor create(Columns columns) {
        var converterExecutor = new ConverterExecutor(columns);
        
        converterExecutor.setGeometryConverter(database.getGeometryConverter());
        converterExecutor.setArrayConverter(database.getArrayConverter());
        converterExecutor.setBooleanConverter(database.getBooleanConverter());
        converterExecutor.setJsonConverter(database.getJsonConverter());
        converterExecutor.setStringConverter(database.getStringConverter());
        converterExecutor.setDateConverter(database.getDateConverter());
        
        return converterExecutor;
    }
}

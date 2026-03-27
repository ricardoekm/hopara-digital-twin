package hopara.dataset.row.write;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseClass;

public class WriteSqlBuilder {
    @Autowired
    Database database;    
    
    protected String getPlaceholder(String columnName) {
        return ":" + columnName;
    }

    protected String getGeometryPlaceholder(String columnName) {
        if ( database.isClass(DatabaseClass.POSTGRES) ) {
            return "ST_GeomFromText(:" + columnName + ")";
        }
        else {
            return getPlaceholder(columnName);
        }
    }

    protected String getJsonPlaceholder(String columnName) {
        if ( database.isClass(DatabaseClass.POSTGRES) ) {
            return ":" + columnName + "::JSONB";
        }
        else {
            return getPlaceholder(columnName);
        }
    }
}

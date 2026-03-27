package hopara.dataset.table;

import java.util.List;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;

@Component
public class IndexRepository {
	
	@Autowired
	@Qualifier("dataJdbcTemplate")
	private JdbcTemplate dataJdbcTemplate;

	private String getIndexName(String tableName, String columnName) {
		return  tableName + "_" + columnName + "_spatial";
	}

	private void createSpatialIndex(String tableName, String columnName) {
		var indexName = getIndexName(tableName, columnName);
		String sql = "CREATE INDEX " + indexName +" ON " + tableName + " USING gist (" + columnName + ");";
		dataJdbcTemplate.update(sql);
	}
	
	private void createSpatialIndex(String tableName, Columns columns) {
		for ( var column : columns ) {
			createSpatialIndex(tableName, column.getName());
		}
	}

	public void createIndex(String tableName, String column) {		
		String btreeIndex = "CREATE INDEX " + tableName + "_" + SqlSanitizer.cleanString(column) + " ON " + tableName + "(" + column + ")";
		dataJdbcTemplate.update(btreeIndex);
	}

	
	public void createSpatialIndices(Table table) {		
		createSpatialIndex(table.getSqlName(), table.getColumns().filterType(ColumnType.GEOMETRY));
	}

    public void createUniqueConstraint(String tableName, List<String> columnNames) {
        String columnsCsv = Strings.join(columnNames, ',');
        String indexName = "unique_" + tableName + "_" + Strings.join(columnNames, '_');

        String createIndex = "CREATE UNIQUE INDEX " + indexName + " ON " + tableName + " (" + columnsCsv + ") NULLS NOT DISTINCT";
        dataJdbcTemplate.update(createIndex);
    }
}

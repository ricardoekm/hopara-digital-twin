package hopara.dataset.view;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.row.converter.PostgresJsonConverter;

@Component
public class ViewRowMapper implements RowMapper<View> {   
	@Autowired
	Database database;

	@Autowired
    PostgresJsonConverter jsonConverter;

	@Autowired
	DataSourceRepository dataSourceRepository;

    public static Boolean getNullableBoolean(ResultSet rs, String column) throws SQLException {
        return Optional.ofNullable((Boolean)rs.getObject(column))
                       .map(Boolean::booleanValue).orElse(null);
    }

	public static Integer getNullableInteger(ResultSet rs, String column) throws SQLException {
        return Optional.ofNullable(rs.getBigDecimal(column))
                       .map(BigDecimal::intValue).orElse(null);
    }

	@SuppressWarnings("unchecked")
    protected View getBaseView(ResultSet rs) throws SQLException {
		var view = new View();
		view.setName(rs.getString("view_name"));
		view.setDataSourceName(rs.getString("view_data_source_name"));
	    view.setWriteTableName(rs.getString("view_write_table_name"));
		view.setPrimaryKeyName(rs.getString("view_primary_key_name"));
		view.setVersionColumnName(rs.getString("view_version_column_name"));
        view.setJoin(rs.getString("view_join"));

		var editableColumns = jsonConverter.fromDatabaseFormat(rs.getString("view_editable_columns"),EditableColumns.class);
		if ( editableColumns != null ) {
			view.setEditableColumns((List<EditableColumn>)editableColumns);
		}		
		view.setQuery(rs.getString("view_query"));
		view.setFilterTables(getNullableBoolean(rs, "view_filter_tables"));
		view.setSmartLoad(getNullableBoolean(rs, "view_smart_load"));
		view.setRowCount(getNullableInteger(rs, "view_row_count"));
		view.setUpsert(rs.getBoolean("view_upsert"));

		var writeLevel = rs.getString("view_write_level");
		if ( writeLevel != null ) {
			view.setWriteLevel(WriteLevel.valueOf(writeLevel));
		}

		// When listing all views we don't have a current data source
		if ( dataSourceRepository.isCurrentSet() ) {
			view.setDatabaseClass(database.getDbClass());
		}

		var dataSource = dataSourceRepository.findByNameWithoutPassword(view.getDataSourceName());
		view.setAnnotation(dataSource.getAnnotation());

		return view;
	}

	@Override
	public View mapRow(ResultSet rs, int rowNum) throws SQLException {
		return getBaseView(rs);
	}
}

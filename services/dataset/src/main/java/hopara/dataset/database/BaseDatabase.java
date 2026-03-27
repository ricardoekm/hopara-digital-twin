package hopara.dataset.database;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.row.converter.PostgresJsonConverter;
import hopara.dataset.column.ColumnType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.row.converter.Converter;
import hopara.dataset.row.converter.DateConverter;
import hopara.dataset.row.read.condition.TemporalConditionBuilder;
import hopara.dataset.row.read.condition.BooleanConditionBuilder;
import hopara.dataset.row.read.condition.NumericConditionBuilder;
import hopara.dataset.row.read.condition.StringConditionBuilder;

public abstract class BaseDatabase implements Database {
    Boolean quoteIdentifiers = false;

    public abstract DatabaseType getType();
    
    public Boolean isType(DatabaseType databaseType) {
        return databaseType == getType();
    }
    
    public abstract DatabaseClass getDbClass();

    public void setQuoteIdentifiers(Boolean quoteIdentifiers) {
        this.quoteIdentifiers = quoteIdentifiers;
    }

    public Boolean getQuoteIdentifiers() {
        return quoteIdentifiers;
    }

    public String getServerPort(DataSource dataSource) {
        Integer port = getDefaultPort();
        if ( dataSource.hasPort() ) {
            port = dataSource.getPort();
        }

        return dataSource.getHost() + ":" + port;
    }

    @Override
    public String getTestJdbcUrl(DataSource dataSource) {
        return getJdbcUrl(dataSource);
    }

    public Boolean isClass(DatabaseClass databaseClass) {
        return databaseClass == getDbClass();
    }
    
    @Override
    public DateConverter getDateConverter() {
        return new DateConverter();
    }
    
    @Override
    public Converter getJsonConverter() {
        return new PostgresJsonConverter(new ObjectMapper());
    }
    
    @Override
    public StringConditionBuilder getStringConditionBuilder() {
        return new StringConditionBuilder(this);
    }

    @Override
    public TemporalConditionBuilder getTemporalConditionBuilder() {
        return new TemporalConditionBuilder(this);
    }

    @Override
    public BooleanConditionBuilder getBooleanConditionBuilder() {
        return new BooleanConditionBuilder(this);
    }

    @Override
    public NumericConditionBuilder getNumericConditionBuilder() {
        return new NumericConditionBuilder(this);
    }

    @Override
	public String getSqlType(ColumnType columnType) {
		return columnType.getSqlType();
	}

    @Override
    public Boolean supportSrid() {
        return false;
    }
}

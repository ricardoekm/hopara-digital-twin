package hopara.dataset.column;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseType;

@Component
public class ColumnFromMetadataExtractor implements ResultSetExtractor<Columns> {
    
    private Log logger = LogFactory.getLog(ColumnFromMetadataExtractor.class);

    @Autowired
    Database database;

    @Autowired
    ColumnFactory columnFactory;

    public ColumnType getColumnTypeFromSqlType(int sqlType) {
        switch(sqlType) {
            case java.sql.Types.BIGINT:
            case java.sql.Types.INTEGER:
            case java.sql.Types.TINYINT:
                return ColumnType.INTEGER;
            case java.sql.Types.TIMESTAMP:
            case java.sql.Types.TIME:
            case java.sql.Types.DATE:
                return ColumnType.DATETIME;
            case java.sql.Types.BOOLEAN:
            case java.sql.Types.BIT:
                return ColumnType.BOOLEAN;
            case java.sql.Types.ARRAY:
                return ColumnType.STRING_ARRAY;
            case java.sql.Types.DECIMAL:
            case java.sql.Types.DOUBLE:
            case java.sql.Types.FLOAT:
            case java.sql.Types.NUMERIC:
            case java.sql.Types.REAL:
                return ColumnType.DECIMAL;
            case java.sql.Types.JAVA_OBJECT:
            case java.sql.Types.STRUCT:
                return ColumnType.JSON;
            case java.sql.Types.OTHER:
                // need to find in another way
                return null;
        }
        
//        case java.sql.Types.BINARY:
//        case java.sql.Types.BLOB:
//        case java.sql.Types.CHAR:
//        case java.sql.Types.CLOB:
//        case java.sql.Types.DATALINK:
//        case java.sql.Types.DISTINCT:
//        case java.sql.Types.LONGNVARCHAR:
//        case java.sql.Types.LONGVARBINARY:
//        case java.sql.Types.LONGVARCHAR:
//        case java.sql.Types.NCHAR:
//        case java.sql.Types.NCLOB:
//        case java.sql.Types.NULL:
//        case java.sql.Types.NVARCHAR:
//        case java.sql.Types.OTHER:
//        case java.sql.Types.REAL:
//        case java.sql.Types.REF:
//        case java.sql.Types.ROWID:
//        case java.sql.Types.SMALLINT:
//        case java.sql.Types.SQLXML:
//        case java.sql.Types.VARBINARY:
//        case java.sql.Types.VARCHAR:
        
        return ColumnType.STRING;
    }
    
    public Boolean isSingleStoreGeometry(ResultSetMetaData metadata, Integer index) throws SQLException {
        // Singlestore JDBC driver erroneously returns type string on geometry
        // Precision seems to be the only difference
        if ( database.isType(DatabaseType.SINGLESTORE) ) {
            return (metadata.getColumnType(index) == java.sql.Types.CHAR && metadata.getPrecision(index) == 0) ||
                   (metadata.getColumnType(index) == java.sql.Types.CHAR && metadata.getPrecision(index) == 48) ||
                   (metadata.getColumnType(index) == java.sql.Types.VARBINARY && metadata.getPrecision(index) == 72);
        }        
        
        return false;
    }

    public Boolean isDuckDbBigInt(ResultSetMetaData metadata, Integer index) throws SQLException {
        if ( database.isType(DatabaseType.DUCKDB) ) {
            return "UBIGINT".equals(metadata.getColumnTypeName(index));
        }

        return false;
    }

    public Boolean isDuckDbGeometry(ResultSetMetaData metadata, Integer index) throws SQLException {
        if ( database.isType(DatabaseType.DUCKDB) ) {
            return "GEOMETRY".equals(metadata.getColumnTypeName(index));
        }

        return false;
    }

    public ColumnType getColumnType(ResultSetMetaData metadata, Integer index) throws SQLException {
        if ( isSingleStoreGeometry(metadata, index) ) {
            return ColumnType.GEOMETRY;
        }

        if ( isDuckDbBigInt(metadata, index) ) {
            return ColumnType.INTEGER;
        }

        if ( isDuckDbGeometry(metadata, index) ) {
            return ColumnType.GEOMETRY;
        }

        var type = getColumnTypeFromSqlType(metadata.getColumnType(index));
        if ( type == null ) {
            var typeName = metadata.getColumnTypeName(index);
            if ( typeName.equalsIgnoreCase("GEOMETRY") || typeName.toLowerCase().contains("GEOMETRY".toLowerCase()) ) {
               return ColumnType.GEOMETRY;
            }
            else if ( typeName.equalsIgnoreCase("JSON") || typeName.equalsIgnoreCase("JSONB")) {
                return ColumnType.JSON;
            }
            else if ( typeName.equalsIgnoreCase("UUID")) {
                return ColumnType.STRING;
            }
            
            throw new IllegalArgumentException("Unable to infer type for column " + metadata.getColumnName(index));
        }
        
        return type;
    }
    
    @Override
    public Columns extractData(ResultSet rs) throws SQLException, DataAccessException {
        var columns = new Columns();
        var metadata = rs.getMetaData();
        
        for(int i = 1; i <= metadata.getColumnCount(); i++){
        try {
                var column = columnFactory.create(metadata.getColumnName(i),getColumnType(metadata, i));
                columns.add(column);   
            }
            catch(Exception e) {
                if ( e instanceof IllegalColumnNameException ) {
                    throw e;
                }

                logger.error("Error infering column",e);
            }
        }
        
        return columns;
    }

}

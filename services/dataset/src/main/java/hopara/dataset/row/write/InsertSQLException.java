package hopara.dataset.row.write;

import org.springframework.dao.DataAccessException;

import hopara.dataset.table.Table;

public class InsertSQLException extends RuntimeException {

    Table table;
    DataAccessException e;

    public InsertSQLException(Table table, DataAccessException e) {
        this.table = table;
        this.e = e;
    }

    @Override
    public String getMessage() {
        return "Error writing to " + table.getName() + ": " + e.getMessage();
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}

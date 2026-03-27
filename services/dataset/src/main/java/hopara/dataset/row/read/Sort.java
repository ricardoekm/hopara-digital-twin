package hopara.dataset.row.read;

import hopara.dataset.database.Database;

public interface Sort {
    public String getClause(Database database);
}

package hopara.dataset.web.query;

import javax.validation.constraints.NotNull;

public class RunQueryRequest {
    @NotNull
    String dataSource;

    @NotNull
    String query;

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }
}

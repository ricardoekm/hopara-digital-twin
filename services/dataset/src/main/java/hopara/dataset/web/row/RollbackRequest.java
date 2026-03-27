package hopara.dataset.web.row;

import javax.validation.constraints.NotNull;

import hopara.dataset.filter.Filters;

public class RollbackRequest {
    @NotNull
    private Object date; // We can work with any format (see TemporalConditionBuilder)
    private Filters filters;

    public Object getDate() {
        return date;
    }

    public void setDate(Object date) {
        this.date = date;
    }

    public Filters getFilters() {
        return filters;
    }

    public void setFilters(Filters filters) {
        this.filters = filters;
    }
}

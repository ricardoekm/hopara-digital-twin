package hopara.dataset.row.read;

public class Pagination {
    Integer limit;
    Integer offset;

    public Pagination() {
        
    }

    public Pagination(Integer limit) {
        this.limit = limit;
    }

    public Pagination(Integer limit, Integer offset) {
        this.limit = limit;
        this.offset = offset;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }

    public Integer getOffset() {
        return offset;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((limit == null) ? 0 : limit.hashCode());
        result = prime * result + ((offset == null) ? 0 : offset.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Pagination other = (Pagination) obj;
        if (limit == null) {
            if (other.limit != null)
                return false;
        } else if (!limit.equals(other.limit))
            return false;
        if (offset == null) {
            if (other.offset != null)
                return false;
        } else if (!offset.equals(other.offset))
            return false;
        return true;
    }
}

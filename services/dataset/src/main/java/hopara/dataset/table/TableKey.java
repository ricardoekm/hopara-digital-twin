package hopara.dataset.table;

public class TableKey {
    String dataSourceName;
    String name;

    public TableKey(String dataSourceName, String name) {
        this.dataSourceName = dataSourceName;
        this.name = name;
    }

    public TableKey(String name) {
        this.name = name;
    }
    
    public String getDataSourceName() {
        return dataSourceName;
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return dataSourceName + "#" + name;
    }

    @Override
    public String toString() {
        return dataSourceName + "#" + name;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((dataSourceName == null) ? 0 : dataSourceName.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
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
        TableKey other = (TableKey) obj;
        if (dataSourceName == null) {
            if (other.dataSourceName != null)
                return false;
        } else if (!dataSourceName.equals(other.dataSourceName))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        return true;
    }
}

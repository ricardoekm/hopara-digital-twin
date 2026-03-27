package hopara.dataset.view;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ViewKey implements Comparable<ViewKey> {
    String dataSourceName;
    String name;

    public ViewKey() {}

    public ViewKey(String dataSourceName, String name) {
        this.dataSourceName = dataSourceName;
        this.name = name;
    }
    
    @JsonProperty("dataSource")
    public String getDataSourceName() {
        return dataSourceName;
    }

    public String getName() {
        return name;
    }

    @JsonIgnore
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
        ViewKey other = (ViewKey) obj;
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

    @Override
    public int compareTo(ViewKey other) {
        return getName().compareTo(other.getName());
    }    
}

package hopara.dataset.datafile;

public class DataFilePath {
    String tenant;
    String dataSourceName;
    String baseDir;

    public DataFilePath(String baseDir, String tenant, String dataSourceName) {
        this.tenant = tenant;
        this.dataSourceName = dataSourceName;
        this.baseDir = baseDir;
    }

    public String getBaseDir() {
        return baseDir;
    }

    public String getRelativeDir() {
        return tenant + "/" + dataSourceName + "/";
    }

    public String getRelativeFilePath(String fileName) {
        return getRelativeDir() + fileName; 
    }

    public String getDir() {
        return getBaseDir() + '/' + getRelativeDir();
    }

    public String getFilePath(String fileName) {
        return getDir() + fileName; 
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((tenant == null) ? 0 : tenant.hashCode());
        result = prime * result + ((dataSourceName == null) ? 0 : dataSourceName.hashCode());
        result = prime * result + ((baseDir == null) ? 0 : baseDir.hashCode());
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
        DataFilePath other = (DataFilePath) obj;
        if (tenant == null) {
            if (other.tenant != null)
                return false;
        } else if (!tenant.equals(other.tenant))
            return false;
        if (dataSourceName == null) {
            if (other.dataSourceName != null)
                return false;
        } else if (!dataSourceName.equals(other.dataSourceName))
            return false;
        if (baseDir == null) {
            if (other.baseDir != null)
                return false;
        } else if (!baseDir.equals(other.baseDir))
            return false;
        return true;
    }

    
}

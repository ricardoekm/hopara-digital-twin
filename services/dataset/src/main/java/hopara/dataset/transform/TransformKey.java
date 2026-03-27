package hopara.dataset.transform;

import java.io.Serializable;

import hopara.dataset.view.ViewKey;

public class TransformKey implements Serializable {
    String dataSourceName;
    String viewName;
    TransformType transformType;

    public TransformKey() {}

    public TransformKey(String dataSourceName, String viewName, TransformType transformType) {
        this.dataSourceName = dataSourceName;
        this.viewName = viewName;
        this.transformType = transformType;
    }

    public TransformKey(ViewKey viewKey, TransformType transformType) {
        this.dataSourceName = viewKey.getDataSourceName();
        this.viewName = viewKey.getName();
        this.transformType = transformType;
    }

    public String getId() {
        return dataSourceName + "#" + viewName + "#" + transformType;
    }

    public TransformType getType() {
        return this.transformType;
    }

    public ViewKey getViewKey() {
        return new ViewKey(dataSourceName, viewName);
    }

    @Override
    public String toString() {
        return getId();
    }
}

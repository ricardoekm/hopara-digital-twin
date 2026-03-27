package hopara.dataset.notification;

import java.util.Map;

import hopara.dataset.row.Row;
import hopara.dataset.view.ViewKey;

public class RowUpdateNotification implements Notification {

    private ViewKey viewKey;
    private Row row;

    public RowUpdateNotification(ViewKey viewKey, Row row) {
        this.viewKey = viewKey;
        this.row = row;
    }

    @Override
    public String getEvent() {
        return "ROW_CHANGE";
    }

    public ViewKey getView() {
        return viewKey;
    }

    public Map<String,Object> getRow() {
        return row.getValues();
    }

    public Object getRowId() {
        return row.getId();
    }
    
    @Override
    public String toString() {
        return getEvent() + " " + viewKey;
    }
}

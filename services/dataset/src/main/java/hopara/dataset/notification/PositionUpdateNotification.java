package hopara.dataset.notification;

import java.util.Map;

import hopara.dataset.row.Row;
import hopara.dataset.view.ViewKey;

public class PositionUpdateNotification implements Notification {

    private ViewKey viewKey;
    private Row row;

    public PositionUpdateNotification(ViewKey viewKey, Row row) {
        this.viewKey = viewKey;
        this.row = row;
    }

    @Override
    public String getEvent() {
        return "POSITION_CHANGE";
    }

    public ViewKey getView() {
        return viewKey;
    }

    public Map<String, Object> getRow() {
        return row.getValues();
    }

    public Object getRowId() {
        if ( row != null ) {
            return row.getId();
        }
        return null;
    }

    @Override
    public String toString() {
        return getEvent() + " " + viewKey;
    }
}
